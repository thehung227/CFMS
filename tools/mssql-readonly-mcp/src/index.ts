/**
 * newtecons-sql-readonly — read-only MCP server (stdio) for Microsoft SQL Server.
 *
 * Security layers (outermost first):
 *  1. SQL login `claude_mcp_ro` (db_datareader, db_denydatawriter, VIEW DEFINITION, DENY EXECUTE).
 *     This is the PRIMARY protection; this process never changes permissions.
 *  2. Catalog tools run fixed, parameterized queries against sys.* views only.
 *  3. `read_query` accepts a single SELECT / WITH statement validated by sql-guard.ts.
 *  4. Row cap (MCP_SQL_MAX_ROWS), request timeout and a tiny connection pool.
 *
 * stdout is reserved for the MCP JSON-RPC protocol: every log line goes to stderr.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import sql from "mssql";
import { z } from "zod";
import { MAX_QUERY_LENGTH, validateReadOnlyQuery } from "./sql-guard.js";

const SERVER_NAME = "newtecons-sql-readonly";
const SERVER_VERSION = "1.0.0";

// Anything on stdout that is not a JSON-RPC message breaks the protocol, so route
// stray console output (ours or from dependencies) to stderr.
console.log = console.info = console.debug = (...args: unknown[]) => console.error(...args);

function log(message: string): void {
  console.error(`[${SERVER_NAME}] ${redact(message)}`);
}

/** Last-resort scrub in case a driver error ever echoes the password. */
function redact(text: string): string {
  const secret = process.env.MCP_SQL_PASSWORD;
  return secret && secret.length >= 4 ? text.split(secret).join("***") : text;
}

// ---------------------------------------------------------------------------
// Configuration (environment variables only — nothing is hard-coded)
// ---------------------------------------------------------------------------

const CATALOG_ROW_LIMIT = 100_000;
const MAX_CELL_CHARS = 4_000;

interface Settings {
  sqlConfig: sql.config | null;
  missing: string[];
  maxRows: number;
  target: string;
}

function readEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function readIntEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = readEnv(name);
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    log(`${name}="${raw}" không hợp lệ (cho phép ${min}..${max}), dùng mặc định ${fallback}.`);
    return fallback;
  }
  return value;
}

function readBoolEnv(name: string, fallback: boolean): boolean {
  const raw = readEnv(name).toLowerCase();
  if (["1", "true", "yes"].includes(raw)) return true;
  if (["0", "false", "no"].includes(raw)) return false;
  return fallback;
}

function loadSettings(): Settings {
  const maxRows = readIntEnv("MCP_SQL_MAX_ROWS", 500, 1, 10_000);
  const required = ["MCP_SQL_SERVER", "MCP_SQL_DATABASE", "MCP_SQL_USER", "MCP_SQL_PASSWORD"];
  const missing = required.filter((name) => !readEnv(name));
  if (missing.length > 0) {
    return { sqlConfig: null, missing, maxRows, target: "(chưa cấu hình)" };
  }

  // Accept "HOST\INSTANCE": a named instance is resolved via SQL Browser, so no port is sent.
  let server = readEnv("MCP_SQL_SERVER");
  let instanceName: string | undefined;
  const slash = server.indexOf("\\");
  if (slash > 0) {
    instanceName = server.slice(slash + 1);
    server = server.slice(0, slash);
  }
  const port = readIntEnv("MCP_SQL_PORT", 1433, 1, 65_535);
  const database = readEnv("MCP_SQL_DATABASE");
  const user = readEnv("MCP_SQL_USER");

  const sqlConfig: sql.config = {
    server,
    database,
    user,
    password: process.env.MCP_SQL_PASSWORD ?? "",
    connectionTimeout: 15_000,
    requestTimeout: readIntEnv("MCP_SQL_REQUEST_TIMEOUT_MS", 30_000, 1_000, 300_000),
    pool: { min: 0, max: 2, idleTimeoutMillis: 60_000 },
    options: {
      appName: "newtecons-sql-readonly-mcp",
      // Internal SQL Servers usually have self-signed certificates.
      encrypt: readBoolEnv("MCP_SQL_ENCRYPT", true),
      trustServerCertificate: readBoolEnv("MCP_SQL_TRUST_SERVER_CERTIFICATE", true),
    },
  };
  if (instanceName) {
    sqlConfig.options!.instanceName = instanceName;
  } else {
    sqlConfig.port = port;
  }

  const target = `server=${server}${instanceName ? `\\${instanceName}` : `:${port}`} database=${database} user=${user}`;
  return { sqlConfig, missing, maxRows, target };
}

const settings = loadSettings();

// ---------------------------------------------------------------------------
// Connection pool (lazy, shared, recreated after a fatal pool error)
// ---------------------------------------------------------------------------

class ToolInputError extends Error {}

let poolPromise: Promise<sql.ConnectionPool> | null = null;

function getPool(): Promise<sql.ConnectionPool> {
  const config = settings.sqlConfig;
  if (!config) {
    return Promise.reject(
      new ToolInputError(
        `Chưa cấu hình biến môi trường: ${settings.missing.join(", ")}. ` +
          "Hãy set bằng setx rồi restart VS Code.",
      ),
    );
  }
  if (!poolPromise) {
    const pool = new sql.ConnectionPool(config);
    const connecting = pool.connect();
    poolPromise = connecting;
    const discard = () => {
      if (poolPromise === connecting) poolPromise = null;
      pool.close().catch(() => undefined);
    };
    pool.on("error", (err: unknown) => {
      log(`Connection pool error: ${describeError(err)}`);
      discard();
    });
    connecting.catch(discard);
  }
  return poolPromise;
}

// ---------------------------------------------------------------------------
// Query execution
// ---------------------------------------------------------------------------

type SqlType = Parameters<sql.Request["input"]>[1];
type QueryParams = Record<string, { type: SqlType; value: unknown }>;

interface QueryResult {
  columns: string[];
  rows: unknown[][];
  truncated: boolean;
}

interface RunOptions {
  maxRows?: number;
  /** Shorten very long string cells (default true). */
  truncateCells?: boolean;
}

/**
 * Runs a single-result-set statement in streaming mode and stops reading as soon
 * as `maxRows` rows are collected, so a large table is never pulled into memory.
 * Uses a plain SQL batch (not sp_executesql), so it does not depend on EXECUTE permission.
 */
async function runQuery(text: string, params: QueryParams = {}, options: RunOptions = {}): Promise<QueryResult> {
  const limit = options.maxRows ?? CATALOG_ROW_LIMIT;
  const truncateCells = options.truncateCells ?? true;
  const pool = await getPool();

  return new Promise<QueryResult>((resolve, reject) => {
    const request = pool.request();
    request.stream = true;
    request.arrayRowMode = true;
    for (const [name, param] of Object.entries(params)) {
      request.input(name, param.type, param.value);
    }

    let columns: string[] = [];
    const rows: unknown[][] = [];
    const errors: Error[] = [];
    let recordsets = 0;
    let truncated = false;

    request.on("recordset", (metadata: unknown) => {
      recordsets++;
      if (recordsets === 1) columns = columnNames(metadata);
    });
    request.on("row", (row: unknown[]) => {
      if (recordsets !== 1 || truncated) return;
      if (rows.length < limit) {
        rows.push(row.map((value) => normalizeValue(value, truncateCells)));
        return;
      }
      truncated = true;
      request.cancel(); // tell SQL Server to stop sending rows
    });
    request.on("error", (err: Error) => {
      // After our own cancel() the driver reports "Canceled." — that is expected.
      if (!truncated) errors.push(err);
    });
    request.on("done", () => {
      if (errors.length > 0) {
        const first = errors[0];
        const messages = [...new Set(errors.map((e) => e.message))];
        if (messages.length > 1) first.message = messages.join(" | ");
        reject(first);
      } else {
        resolve({ columns, rows, truncated });
      }
    });

    request.batch(text).catch(reject);
  });
}

function columnNames(metadata: unknown): string[] {
  const list = (Array.isArray(metadata) ? metadata : Object.values(metadata as object)) as {
    index: number;
    name: string;
  }[];
  return [...list].sort((a, b) => a.index - b.index).map((col) => col.name || "(No column name)");
}

function normalizeValue(value: unknown, truncateCells: boolean): unknown {
  if (value === null || value === undefined) return null;
  // mssql reads datetime as UTC by default, so the UTC fields equal the stored value.
  if (value instanceof Date) return value.toISOString().replace("T", " ").replace("Z", "");
  if (Buffer.isBuffer(value)) {
    const hex = value.subarray(0, 32).toString("hex").toUpperCase();
    return `0x${hex}${value.length > 32 ? `… (${value.length} bytes)` : ""}`;
  }
  if (typeof value === "bigint") return value.toString();
  if (truncateCells && typeof value === "string" && value.length > MAX_CELL_CHARS) {
    return `${value.slice(0, MAX_CELL_CHARS)}… [đã cắt, tổng ${value.length} ký tự]`;
  }
  return value;
}

function rowToObject(result: QueryResult, index = 0): Record<string, unknown> {
  const row = result.rows[index] ?? [];
  return Object.fromEntries(result.columns.map((name, i) => [name, row[i]]));
}

/** Compact JSON: header fields first, then one row (array) per line. */
function formatResult(result: QueryResult, extra: Record<string, unknown> = {}): string {
  const header = JSON.stringify({
    ...extra,
    rowCount: result.rows.length,
    truncated: result.truncated,
    columns: result.columns,
  });
  const rowLines = result.rows.map((row) => JSON.stringify(row)).join(",\n");
  return `${header.slice(0, -1)},"rows":[\n${rowLines}\n]}`;
}

// ---------------------------------------------------------------------------
// Errors and tool plumbing
// ---------------------------------------------------------------------------

function describeError(err: unknown): string {
  if (err instanceof ToolInputError) return err.message;

  const e = (err ?? {}) as { message?: string; code?: string; number?: number; lineNumber?: number };
  const message = e.message || String(err);
  const details: string[] = [];
  if (e.code) details.push(`code=${e.code}`);
  if (typeof e.number === "number") details.push(`sqlError=${e.number}`);
  if (typeof e.lineNumber === "number") details.push(`line=${e.lineNumber}`);

  let hint = "";
  if (e.code === "ELOGIN") {
    hint = " Gợi ý: kiểm tra MCP_SQL_USER / MCP_SQL_PASSWORD / MCP_SQL_DATABASE.";
  } else if (e.code === "ESOCKET" || e.code === "EINSTLOOKUP" || (e.code === "ETIMEOUT" && !e.number)) {
    hint =
      " Gợi ý: kiểm tra MCP_SQL_SERVER / MCP_SQL_PORT, firewall, VPN. " +
      "Nếu SQL Server cũ không hỗ trợ TLS 1.2, thử setx MCP_SQL_ENCRYPT \"false\".";
  } else if (e.number === 229 || e.number === 230 || e.number === 297 || e.number === 262) {
    hint = " Account read-only không có quyền cho thao tác này — đây là hành vi mong đợi, không đề xuất cấp thêm quyền.";
  } else if (e.code === "ETIMEOUT") {
    hint = " Gợi ý: query chạy quá lâu — hãy thêm WHERE / TOP, dùng COUNT / GROUP BY hoặc thu hẹp phạm vi.";
  }

  return redact(`Lỗi SQL Server: ${message}${details.length ? ` (${details.join(", ")})` : ""}.${hint}`);
}

function textResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

function errorResult(text: string): CallToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

/** Never lets an exception escape a tool handler: errors become isError results. */
async function safely(tool: string, work: () => Promise<string>): Promise<CallToolResult> {
  const started = Date.now();
  try {
    const text = await work();
    log(`${tool}: ok (${Date.now() - started} ms)`);
    return textResult(text);
  } catch (err) {
    const message = describeError(err);
    log(`${tool}: failed (${Date.now() - started} ms): ${message}`);
    return errorResult(message);
  }
}

// ---------------------------------------------------------------------------
// Object name helpers
// ---------------------------------------------------------------------------

function unquote(part: string): string {
  const p = part.trim();
  if (p.startsWith("[") && p.endsWith("]")) return p.slice(1, -1).replace(/\]\]/g, "]");
  if (p.startsWith('"') && p.endsWith('"')) return p.slice(1, -1).replace(/""/g, '"');
  return p;
}

/** "dbo.Users", "[dbo].[Users]" or "Users" → { schema, name }. */
function splitName(raw: string, defaultSchema: string | null): { schema: string | null; name: string } {
  const parts = raw.split(".").map(unquote);
  if (parts.some((p) => p === "")) throw new ToolInputError(`Tên object không hợp lệ: ${raw}`);
  if (parts.length === 1) return { schema: defaultSchema, name: parts[0] };
  if (parts.length === 2) return { schema: parts[0], name: parts[1] };
  throw new ToolInputError(`Chỉ hỗ trợ dạng schema.object (không hỗ trợ tên database/server): ${raw}`);
}

function likePattern(text: string | undefined): string | null {
  return text ? `%${text.replace(/[[%_]/g, (ch) => `[${ch}]`)}%` : null;
}

interface FoundObject {
  objectId: number;
  fullName: string;
  typeDesc: string;
}

async function findObject(schema: string, name: string, types: string[]): Promise<FoundObject> {
  const typeList = types.map((t) => `'${t}'`).join(", "); // internal constants only
  const result = await runQuery(
    `SELECT o.object_id, s.name AS SchemaName, o.name AS ObjectName, o.type_desc
     FROM sys.objects o
     JOIN sys.schemas s ON s.schema_id = o.schema_id
     WHERE s.name = @schema AND o.name = @name AND o.type IN (${typeList})`,
    { schema: { type: sql.NVarChar(128), value: schema }, name: { type: sql.NVarChar(128), value: name } },
  );

  if (result.rows.length === 0) {
    const similar = await runQuery(
      `SELECT TOP (10) s.name + '.' + o.name AS Name
       FROM sys.objects o
       JOIN sys.schemas s ON s.schema_id = o.schema_id
       WHERE o.type IN (${typeList}) AND o.name LIKE @pattern
       ORDER BY o.name`,
      { pattern: { type: sql.NVarChar(260), value: likePattern(name) } },
    );
    const suggestions = similar.rows.map((r) => r[0]).join(", ");
    throw new ToolInputError(
      `Không tìm thấy ${schema}.${name}.` + (suggestions ? ` Tên gần giống: ${suggestions}` : ""),
    );
  }

  const [objectId, schemaName, objectName, typeDesc] = result.rows[0] as [number, string, string, string];
  return { objectId, fullName: `${schemaName}.${objectName}`, typeDesc };
}

async function resolveTable(schemaArg: string, tableArg: string, types: string[]): Promise<FoundObject> {
  const { schema, name } = splitName(tableArg, unquote(schemaArg));
  return findObject(schema ?? "dbo", name, types);
}

// ---------------------------------------------------------------------------
// Catalog SQL (sys.* metadata only)
// ---------------------------------------------------------------------------

const TEST_CONNECTION_SQL = `
SELECT
  CAST(@@SERVERNAME AS nvarchar(256)) AS ServerName,
  DB_NAME() AS DatabaseName,
  SUSER_SNAME() AS LoginName,
  USER_NAME() AS DatabaseUser,
  CONVERT(varchar(34), SYSDATETIMEOFFSET(), 126) AS ServerTime,
  CAST(SERVERPROPERTY('ProductVersion') AS nvarchar(128)) AS ProductVersion,
  CAST(SERVERPROPERTY('Edition') AS nvarchar(128)) AS Edition,
  IS_SRVROLEMEMBER('sysadmin') AS IsSysadmin,
  IS_MEMBER('db_owner') AS IsDbOwner,
  IS_MEMBER('db_datareader') AS IsDbDataReader,
  IS_MEMBER('db_denydatawriter') AS IsDbDenyDataWriter`;

/**
 * List queries are split into SELECT list / FROM+WHERE / ORDER BY so one filter
 * serves both the page query and the total count. Large databases have
 * thousands of objects, so results are paged to fit Claude's tool output limit.
 */
interface ListQuery {
  select: string;
  from: string;
  orderBy: string;
}

const LIST_TABLES: ListQuery = {
  select: `s.name AS SchemaName, t.name AS TableName,
  CAST((SELECT SUM(p.rows) FROM sys.partitions p
        WHERE p.object_id = t.object_id AND p.index_id IN (0, 1)) AS bigint) AS ApproxRowCount`,
  from: `sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
WHERE t.is_ms_shipped = 0
  AND (@schema IS NULL OR s.name = @schema)
  AND (@pattern IS NULL OR t.name LIKE @pattern)`,
  orderBy: "s.name, t.name",
};

const LIST_VIEWS: ListQuery = {
  select: `s.name AS SchemaName, v.name AS ViewName,
  CONVERT(varchar(19), v.modify_date, 120) AS ModifyDate`,
  from: `sys.views v
JOIN sys.schemas s ON s.schema_id = v.schema_id
WHERE v.is_ms_shipped = 0
  AND (@schema IS NULL OR s.name = @schema)
  AND (@pattern IS NULL OR v.name LIKE @pattern)`,
  orderBy: "s.name, v.name",
};

const LIST_PROCEDURES: ListQuery = {
  select: `s.name AS SchemaName, p.name AS ProcedureName,
  CONVERT(varchar(19), p.modify_date, 120) AS ModifyDate`,
  from: `sys.procedures p
JOIN sys.schemas s ON s.schema_id = p.schema_id
WHERE p.is_ms_shipped = 0
  AND (@schema IS NULL OR s.name = @schema)
  AND (@pattern IS NULL OR p.name LIKE @pattern)`,
  orderBy: "s.name, p.name",
};

const LIST_FUNCTIONS: ListQuery = {
  select: `s.name AS SchemaName, o.name AS FunctionName,
  CASE o.type
    WHEN 'FN' THEN 'SCALAR'
    WHEN 'IF' THEN 'INLINE_TABLE_VALUED'
    WHEN 'TF' THEN 'TABLE_VALUED'
    WHEN 'FS' THEN 'CLR_SCALAR'
    ELSE 'CLR_TABLE_VALUED'
  END AS FunctionType,
  CONVERT(varchar(19), o.modify_date, 120) AS ModifyDate`,
  from: `sys.objects o
JOIN sys.schemas s ON s.schema_id = o.schema_id
WHERE o.is_ms_shipped = 0
  AND o.type IN ('FN', 'IF', 'TF', 'FS', 'FT')
  AND (@schema IS NULL OR s.name = @schema)
  AND (@pattern IS NULL OR o.name LIKE @pattern)`,
  orderBy: "s.name, o.name",
};

const TABLE_SCHEMA_SQL = `
SELECT
  s.name AS SchemaName,
  o.name AS TableName,
  c.column_id AS ColumnId,
  c.name AS ColumnName,
  ty.name AS DataType,
  CASE
    WHEN ty.name IN ('varchar', 'char', 'varbinary', 'binary')
      THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length AS varchar(10)) END + ')'
    WHEN ty.name IN ('nvarchar', 'nchar')
      THEN ty.name + '(' + CASE WHEN c.max_length = -1 THEN 'max' ELSE CAST(c.max_length / 2 AS varchar(10)) END + ')'
    WHEN ty.name IN ('decimal', 'numeric')
      THEN ty.name + '(' + CAST(c.precision AS varchar(10)) + ',' + CAST(c.scale AS varchar(10)) + ')'
    WHEN ty.name IN ('datetime2', 'time', 'datetimeoffset')
      THEN ty.name + '(' + CAST(c.scale AS varchar(10)) + ')'
    ELSE ty.name
  END AS FullType,
  CASE WHEN c.max_length = -1 THEN -1
       WHEN ty.name IN ('nvarchar', 'nchar') THEN c.max_length / 2
       ELSE c.max_length END AS MaxLength,
  c.precision AS [Precision],
  c.scale AS Scale,
  c.is_nullable AS IsNullable,
  c.is_identity AS IsIdentity,
  c.is_computed AS IsComputed,
  dc.definition AS DefaultValue,
  cc.definition AS ComputedDefinition,
  CAST(CASE WHEN pk.column_id IS NULL THEN 0 ELSE 1 END AS bit) AS IsPrimaryKey,
  CAST(ep.value AS nvarchar(4000)) AS Description
FROM sys.objects o
JOIN sys.schemas s ON s.schema_id = o.schema_id
JOIN sys.columns c ON c.object_id = o.object_id
JOIN sys.types ty ON ty.user_type_id = c.user_type_id
LEFT JOIN sys.default_constraints dc ON dc.object_id = c.default_object_id
LEFT JOIN sys.computed_columns cc ON cc.object_id = c.object_id AND cc.column_id = c.column_id
LEFT JOIN (
  SELECT ic.object_id, ic.column_id
  FROM sys.indexes i
  JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
  WHERE i.is_primary_key = 1
) pk ON pk.object_id = c.object_id AND pk.column_id = c.column_id
LEFT JOIN sys.extended_properties ep
  ON ep.class = 1 AND ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.name = 'MS_Description'
WHERE o.object_id = @objectId
ORDER BY c.column_id`;

const FOREIGN_KEYS_SQL = `
SELECT
  fk.name AS ForeignKeyName,
  CASE WHEN fk.parent_object_id = @objectId THEN 'OUTGOING' ELSE 'INCOMING' END AS Direction,
  ps.name AS SchemaName,
  po.name AS TableName,
  pc.name AS ColumnName,
  rs.name AS ReferencedSchema,
  ro.name AS ReferencedTable,
  rc.name AS ReferencedColumn,
  fkc.constraint_column_id AS ColumnOrdinal,
  fk.delete_referential_action_desc AS OnDelete,
  fk.update_referential_action_desc AS OnUpdate,
  fk.is_disabled AS IsDisabled
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
JOIN sys.objects po ON po.object_id = fk.parent_object_id
JOIN sys.schemas ps ON ps.schema_id = po.schema_id
JOIN sys.columns pc ON pc.object_id = fkc.parent_object_id AND pc.column_id = fkc.parent_column_id
JOIN sys.objects ro ON ro.object_id = fk.referenced_object_id
JOIN sys.schemas rs ON rs.schema_id = ro.schema_id
JOIN sys.columns rc ON rc.object_id = fkc.referenced_object_id AND rc.column_id = fkc.referenced_column_id
WHERE fk.parent_object_id = @objectId OR fk.referenced_object_id = @objectId
ORDER BY Direction DESC, fk.name, fkc.constraint_column_id`;

const INDEXES_SQL = `
SELECT
  i.name AS IndexName,
  i.type_desc AS IndexType,
  i.is_unique AS IsUnique,
  i.is_primary_key AS IsPrimaryKey,
  i.is_unique_constraint AS IsUniqueConstraint,
  i.is_disabled AS IsDisabled,
  i.filter_definition AS FilterDefinition,
  c.name AS ColumnName,
  ic.key_ordinal AS KeyOrdinal,
  ic.is_descending_key AS IsDescending,
  ic.is_included_column AS IsIncludedColumn
FROM sys.indexes i
JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.object_id = @objectId AND i.type > 0
ORDER BY i.is_primary_key DESC, i.name, ic.is_included_column, ic.key_ordinal, ic.index_column_id`;

const OBJECT_DEFINITION_SQL = `
SELECT TOP (20)
  s.name AS SchemaName,
  o.name AS ObjectName,
  o.type_desc AS ObjectType,
  CONVERT(varchar(19), o.create_date, 120) AS CreateDate,
  CONVERT(varchar(19), o.modify_date, 120) AS ModifyDate,
  OBJECT_SCHEMA_NAME(o.parent_object_id) + '.' + OBJECT_NAME(o.parent_object_id) AS ParentObject,
  m.definition AS Definition
FROM sys.objects o
JOIN sys.schemas s ON s.schema_id = o.schema_id
LEFT JOIN sys.sql_modules m ON m.object_id = o.object_id
WHERE o.name = @name
  AND (@schema IS NULL OR s.name = @schema)
  AND o.type IN ('P', 'V', 'FN', 'IF', 'TF', 'TR')
ORDER BY s.name`;

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

const listFilterShape = {
  schema: z.string().trim().min(1).max(128).optional().describe("Only objects in this schema, e.g. dbo"),
  nameContains: z
    .string()
    .trim()
    .min(1)
    .max(128)
    .optional()
    .describe("Substring filter on the object name (case sensitivity follows the database collation)"),
  offset: z.number().int().min(0).default(0).describe("Number of objects to skip (paging, use nextOffset)"),
  limit: z.number().int().min(1).max(2_000).default(500).describe("Objects per page (default 500)"),
};

const PAGING_HINT = " Paged (default 500 per call): prefer nameContains to filter, or call again with nextOffset.";

const tableShape = {
  schema: z.string().trim().min(1).max(128).default("dbo").describe("Schema name (default dbo)"),
  table: z.string().trim().min(1).max(260).describe("Table name, e.g. Users or dbo.Users"),
};

async function runList(
  query: ListQuery,
  args: { schema?: string; nameContains?: string; offset: number; limit: number },
): Promise<string> {
  const filter: QueryParams = {
    schema: { type: sql.NVarChar(128), value: args.schema ? unquote(args.schema) : null },
    pattern: { type: sql.NVarChar(260), value: likePattern(args.nameContains) },
  };
  const count = await runQuery(`SELECT COUNT(*) AS Total FROM ${query.from}`, filter);
  const page = await runQuery(
    `SELECT ${query.select} FROM ${query.from}
     ORDER BY ${query.orderBy} OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
    { ...filter, offset: { type: sql.Int, value: args.offset }, limit: { type: sql.Int, value: args.limit } },
  );

  const totalCount = Number(count.rows[0]?.[0] ?? 0);
  const nextOffset = args.offset + page.rows.length;
  const extra: Record<string, unknown> = { totalCount, offset: args.offset };
  if (nextOffset < totalCount) {
    extra.nextOffset = nextOffset;
    extra.note = `Còn ${totalCount - nextOffset} object chưa hiển thị. Gọi lại với offset=${nextOffset} hoặc dùng nameContains để lọc.`;
  }
  return formatResult(page, extra);
}

function registerTools(server: McpServer): void {
  server.registerTool(
    "test_connection",
    {
      title: "Test SQL Server connection",
      description:
        "Checks the SQL Server connection. Returns server name, database, current login, server time, version and role flags (warns if the login is not read-only). Never returns the password.",
      annotations: READ_ONLY,
    },
    () =>
      safely("test_connection", async () => {
        const info = rowToObject(await runQuery(TEST_CONNECTION_SQL));
        const warnings: string[] = [];
        if (info.IsSysadmin === 1) {
          warnings.push("CẢNH BÁO: login là sysadmin — DENY không có hiệu lực. Hãy dùng đúng account read-only.");
        }
        if (info.IsDbOwner === 1) warnings.push("CẢNH BÁO: login thuộc db_owner — không phải account read-only.");
        if (info.IsDbDenyDataWriter !== 1) warnings.push("Lưu ý: login không thuộc role db_denydatawriter.");
        return JSON.stringify({ status: "connected", ...info, maxRows: settings.maxRows, warnings }, null, 2);
      }),
  );

  server.registerTool(
    "list_tables",
    {
      title: "List user tables",
      description:
        "Lists user tables (no system tables) with SchemaName, TableName and ApproxRowCount (from metadata, no table scan). Check ApproxRowCount before querying a table's data." +
        PAGING_HINT,
      inputSchema: listFilterShape,
      annotations: READ_ONLY,
    },
    (args) => safely("list_tables", () => runList(LIST_TABLES, args)),
  );

  server.registerTool(
    "get_table_schema",
    {
      title: "Get table schema",
      description:
        "Columns of a user table or view: data type, full type, max length, precision, scale, nullable, identity, computed, default value, primary key flag and MS_Description.",
      inputSchema: tableShape,
      annotations: READ_ONLY,
    },
    (args) =>
      safely("get_table_schema", async () => {
        const obj = await resolveTable(args.schema, args.table, ["U", "V"]);
        const result = await runQuery(TABLE_SCHEMA_SQL, { objectId: { type: sql.Int, value: obj.objectId } });
        return formatResult(result, { object: obj.fullName, objectType: obj.typeDesc });
      }),
  );

  server.registerTool(
    "get_foreign_keys",
    {
      title: "Get foreign keys",
      description:
        "Foreign keys of a user table, both OUTGOING (this table references others) and INCOMING (other tables reference this table).",
      inputSchema: tableShape,
      annotations: READ_ONLY,
    },
    (args) =>
      safely("get_foreign_keys", async () => {
        const obj = await resolveTable(args.schema, args.table, ["U"]);
        const result = await runQuery(FOREIGN_KEYS_SQL, { objectId: { type: sql.Int, value: obj.objectId } });
        const extra: Record<string, unknown> = { object: obj.fullName };
        if (result.rows.length === 0) {
          extra.note =
            "Không có foreign key khai báo. Quan hệ có thể chỉ tồn tại ở tầng ứng dụng — suy luận từ tên cột, stored procedure/view và code backend.";
        }
        return formatResult(result, extra);
      }),
  );

  server.registerTool(
    "get_indexes",
    {
      title: "Get indexes",
      description:
        "Indexes of a user table or indexed view: index name, type, unique, primary key, filter, key columns (KeyOrdinal, descending) and included columns.",
      inputSchema: tableShape,
      annotations: READ_ONLY,
    },
    (args) =>
      safely("get_indexes", async () => {
        const obj = await resolveTable(args.schema, args.table, ["U", "V"]);
        const result = await runQuery(INDEXES_SQL, { objectId: { type: sql.Int, value: obj.objectId } });
        return formatResult(result, { object: obj.fullName });
      }),
  );

  server.registerTool(
    "list_views",
    {
      title: "List user views",
      description: "Lists user views (SchemaName, ViewName, ModifyDate)." + PAGING_HINT,
      inputSchema: listFilterShape,
      annotations: READ_ONLY,
    },
    (args) => safely("list_views", () => runList(LIST_VIEWS, args)),
  );

  server.registerTool(
    "list_procedures",
    {
      title: "List stored procedures",
      description:
        "Lists user stored procedures (SchemaName, ProcedureName, ModifyDate). Procedures are never executed; use get_object_definition to read their source." +
        PAGING_HINT,
      inputSchema: listFilterShape,
      annotations: READ_ONLY,
    },
    (args) => safely("list_procedures", () => runList(LIST_PROCEDURES, args)),
  );

  server.registerTool(
    "list_functions",
    {
      title: "List user functions",
      description:
        "Lists user functions with FunctionType SCALAR, INLINE_TABLE_VALUED, TABLE_VALUED (multi-statement), CLR_SCALAR or CLR_TABLE_VALUED." +
        PAGING_HINT,
      inputSchema: listFilterShape,
      annotations: READ_ONLY,
    },
    (args) => safely("list_functions", () => runList(LIST_FUNCTIONS, args)),
  );

  server.registerTool(
    "get_object_definition",
    {
      title: "Get object definition",
      description:
        "Returns the T-SQL source (sys.sql_modules) of a stored procedure, view, function or DML trigger, without executing it. " +
        "Long definitions are returned in chunks: when the header says there is more, call again with the given offset.",
      inputSchema: {
        objectName: z
          .string()
          .trim()
          .min(1)
          .max(260)
          .describe("Object name, e.g. dbo.usp_GetWeeklyReport (schema optional: searched in all schemas)"),
        offset: z.number().int().min(0).default(0).describe("Character offset to start from (for long definitions)"),
        maxChars: z
          .number()
          .int()
          .min(1_000)
          .max(200_000)
          .default(40_000)
          .describe("Maximum characters to return in this chunk"),
      },
      annotations: READ_ONLY,
    },
    (args) =>
      safely("get_object_definition", async () => {
        const { schema, name } = splitName(args.objectName, null);
        const result = await runQuery(
          OBJECT_DEFINITION_SQL,
          {
            schema: { type: sql.NVarChar(128), value: schema },
            name: { type: sql.NVarChar(128), value: name },
          },
          { truncateCells: false },
        );

        if (result.rows.length === 0) {
          throw new ToolInputError(
            `Không tìm thấy procedure/view/function/trigger tên ${args.objectName}. ` +
              "Dùng list_procedures / list_views / list_functions với nameContains để tìm đúng tên.",
          );
        }
        if (result.rows.length > 1) {
          const names = result.rows.map((_, i) => {
            const o = rowToObject(result, i);
            return `${o.SchemaName}.${o.ObjectName} (${o.ObjectType})`;
          });
          throw new ToolInputError(`Có nhiều object trùng tên, hãy ghi rõ schema: ${names.join(", ")}`);
        }

        const o = rowToObject(result);
        const header = [
          `-- Object: ${o.SchemaName}.${o.ObjectName} (${o.ObjectType})`,
          ...(o.ParentObject ? [`-- Parent: ${o.ParentObject}`] : []),
          `-- Created: ${o.CreateDate}, Modified: ${o.ModifyDate}`,
        ];

        const definition = o.Definition as string | null;
        if (definition === null) {
          header.push("-- Definition = NULL: object được tạo WITH ENCRYPTION hoặc account không có quyền VIEW DEFINITION.");
          return header.join("\n");
        }

        const total = definition.length;
        if (args.offset > 0 && args.offset >= total) {
          throw new ToolInputError(`offset=${args.offset} vượt quá độ dài definition (${total} ký tự).`);
        }
        let end = Math.min(total, args.offset + args.maxChars);
        if (end < total) {
          const lineBreak = definition.lastIndexOf("\n", end);
          if (lineBreak > args.offset) end = lineBreak + 1; // cut on a line boundary
        }
        header.push(`-- Characters: ${args.offset}-${end} / ${total}`);
        if (end < total) {
          header.push(`-- CÒN TIẾP: gọi lại get_object_definition với offset=${end}`);
        }
        header.push("-- " + "-".repeat(60));
        return `${header.join("\n")}\n${definition.slice(args.offset, end)}`;
      }),
  );

  server.registerTool(
    "read_query",
    {
      title: "Run read-only SELECT query",
      description:
        "Runs ONE read-only T-SQL statement that starts with SELECT or WITH (CTE). " +
        "INSERT/UPDATE/DELETE/MERGE/EXEC/DDL, SELECT ... INTO, multiple statements and OPENROWSET/OPENQUERY are rejected before reaching SQL Server. " +
        `Results are capped at MCP_SQL_MAX_ROWS (currently ${settings.maxRows}) rows. ` +
        "This is a PRODUCTION database: COUNT / GROUP BY / WHERE / TOP first, select only needed columns, never SELECT * a large table. " +
        "Datetime values are shown as stored (datetimeoffset in UTC); long text is shortened.",
      inputSchema: {
        query: z.string().min(1).max(MAX_QUERY_LENGTH).describe("A single SELECT or WITH ... SELECT statement"),
        maxRows: z
          .number()
          .int()
          .min(1)
          .optional()
          .describe(`Row limit for this call (cannot exceed ${settings.maxRows})`),
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const verdict = validateReadOnlyQuery(args.query);
      if (!verdict.ok) {
        log("read_query: rejected by validator (not sent to SQL Server)");
        return errorResult(`Query bị từ chối trước khi gửi tới SQL Server. ${verdict.reason}`);
      }
      const limit = Math.min(args.maxRows ?? settings.maxRows, settings.maxRows);
      return safely("read_query", async () => {
        const result = await runQuery(args.query, {}, { maxRows: limit });
        const extra: Record<string, unknown> = { maxRows: limit };
        if (result.truncated) {
          extra.note = `Kết quả đã bị cắt ở ${limit} dòng. Hãy dùng COUNT/GROUP BY, thêm WHERE hoặc chia nhỏ phạm vi thay vì đọc toàn bộ.`;
        }
        return formatResult(result, extra);
      });
    },
  );
}

// ---------------------------------------------------------------------------
// Startup / shutdown
// ---------------------------------------------------------------------------

let shuttingDown = false;

async function shutdown(reason: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  log(`Shutting down (${reason}).`);
  const current = poolPromise;
  poolPromise = null;
  if (current) await current.then((pool) => pool.close()).catch(() => undefined);
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.stdin.on("end", () => void shutdown("stdin closed"));
// Keep the server alive on unexpected errors; they are reported to stderr only.
process.on("uncaughtException", (err) => log(`Uncaught exception: ${describeError(err)}`));
process.on("unhandledRejection", (reason) => log(`Unhandled rejection: ${describeError(reason)}`));

async function main(): Promise<void> {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Read-only access to a PRODUCTION Microsoft SQL Server database. Never try to modify data or schema. " +
        "Inspect metadata first (list_tables with ApproxRowCount, get_table_schema, get_foreign_keys, get_indexes, get_object_definition). " +
        "When reading data with read_query: COUNT / GROUP BY / WHERE / TOP first, select only the needed columns, work in small ranges. " +
        `read_query results are capped at ${settings.maxRows} rows.`,
    },
  );
  registerTools(server);
  await server.connect(new StdioServerTransport());

  if (settings.sqlConfig) {
    log(`Started (stdio). ${settings.target} maxRows=${settings.maxRows}`);
  } else {
    log(`Started (stdio) WITHOUT database config. Missing: ${settings.missing.join(", ")}`);
  }
}

main().catch((err) => {
  log(`Fatal startup error: ${describeError(err)}`);
  process.exit(1);
});
