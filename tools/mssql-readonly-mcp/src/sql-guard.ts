/**
 * Defense-in-depth validator for the `read_query` tool.
 *
 * The PRIMARY protection is the SQL login `claude_mcp_ro`
 * (db_datareader + db_denydatawriter + DENY EXECUTE). This validator only
 * rejects anything that is not a single SELECT / WITH statement before it
 * ever reaches SQL Server. When in doubt it rejects (over-blocking is safe).
 */

export type GuardResult = { ok: true } | { ok: false; reason: string };

export const MAX_QUERY_LENGTH = 50_000;

// T-SQL identifier characters. A keyword glued to one of these is part of an
// identifier. Digits are deliberately NOT in the "before" set: T-SQL parses
// `SELECT 1UPDATE ...` as `SELECT 1` followed by `UPDATE ...`.
const BEFORE = "(?<![A-Za-z_@#])";
const AFTER = "(?![A-Za-z0-9_@$#])";

// LF, CR, NEL, LINE SEPARATOR, PARAGRAPH SEPARATOR (char codes: no raw separators in source).
const LINE_BREAK_CODES = new Set([0x0a, 0x0d, 0x85, 0x2028, 0x2029]);

const BLOCKED_WORDS = [
  "INSERT", "UPDATE", "DELETE", "MERGE", "TRUNCATE", "DROP", "ALTER", "CREATE",
  "EXEC", "EXECUTE", "GRANT", "DENY", "REVOKE", "BACKUP", "RESTORE", "DBCC",
  "KILL", "SHUTDOWN", "BULK", "OPENROWSET", "OPENDATASOURCE", "OPENQUERY",
  "OPENXML", "INTO", "DECLARE", "SET", "WAITFOR", "RECONFIGURE", "CHECKPOINT",
  "BEGIN", "COMMIT", "ROLLBACK", "RECEIVE", "CONVERSATION", "WRITETEXT",
  "UPDATETEXT", "READTEXT", "SETUSER", "REVERT",
];

const BLOCKED_PATTERNS: { label: string; regex: RegExp }[] = [
  ...BLOCKED_WORDS.map((word) => ({
    label: word,
    regex: new RegExp(`${BEFORE}${word}${AFTER}`, "i"),
  })),
  // USE <database> changes the pooled connection's context; `OPTION (USE HINT/PLAN ...)` is a valid SELECT hint.
  { label: "USE", regex: new RegExp(`${BEFORE}USE${AFTER}(?!\\s*(HINT|PLAN)${AFTER})`, "i") },
  { label: "ENABLE/DISABLE TRIGGER", regex: new RegExp(`${BEFORE}(ENABLE|DISABLE)\\s+TRIGGER${AFTER}`, "i") },
  // NEXT VALUE FOR advances a SEQUENCE (a write side effect).
  { label: "NEXT VALUE FOR", regex: new RegExp(`${BEFORE}NEXT\\s+VALUE\\s+FOR${AFTER}`, "i") },
];

class SqlGuardError extends Error {}

/**
 * Replaces comments, string literals and delimited identifiers with neutral
 * placeholders so that keyword checks only see real SQL tokens.
 * Throws SqlGuardError on unterminated or nested constructs.
 */
export function maskSql(input: string): string {
  let out = "";
  let i = 0;
  const n = input.length;

  while (i < n) {
    const ch = input[i];
    const next = input[i + 1];

    if (ch === "-" && next === "-") {
      // Line comment. End it at ANY line-break-like char: ending it earlier than
      // SQL Server would only makes us inspect more text (safe direction).
      i += 2;
      while (i < n && !LINE_BREAK_CODES.has(input.charCodeAt(i))) i++;
      out += " ";
      continue;
    }

    if (ch === "/" && next === "*") {
      i += 2;
      let closed = false;
      while (i < n) {
        if (input[i] === "/" && input[i + 1] === "*") {
          // T-SQL nests block comments; reject instead of relying on matching SQL Server's lexer exactly.
          throw new SqlGuardError("Không cho phép block comment lồng nhau (/* /* */ */).");
        }
        if (input[i] === "*" && input[i + 1] === "/") {
          i += 2;
          closed = true;
          break;
        }
        i++;
      }
      if (!closed) throw new SqlGuardError("Block comment /* ... */ chưa được đóng.");
      out += " ";
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "[") {
      const close = ch === "[" ? "]" : ch;
      i = skipDelimited(input, i, close);
      out += ch === "[" ? " [] " : ` ${ch}${ch} `;
      continue;
    }

    out += ch;
    i++;
  }

  return out;
}

/** Returns the index just after the closing delimiter; a doubled delimiter is an escape. */
function skipDelimited(s: string, start: number, close: string): number {
  let i = start + 1;
  while (i < s.length) {
    if (s[i] === close) {
      if (s[i + 1] === close) {
        i += 2;
        continue;
      }
      return i + 1;
    }
    i++;
  }
  throw new SqlGuardError(`Chuỗi hoặc định danh bắt đầu bằng ${s[start]} chưa được đóng.`);
}

export function validateReadOnlyQuery(query: string): GuardResult {
  if (typeof query !== "string" || query.trim() === "") {
    return { ok: false, reason: "Query rỗng." };
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return { ok: false, reason: `Query quá dài (> ${MAX_QUERY_LENGTH} ký tự).` };
  }

  let masked: string;
  try {
    masked = maskSql(query);
  } catch (err) {
    if (err instanceof SqlGuardError) return { ok: false, reason: err.message };
    throw err;
  }

  // Allow a leading `;` (the `;WITH cte AS ...` convention) and trailing `;`.
  const body = masked.replace(/^[\s;]+/, "").replace(/[\s;]+$/, "");

  if (!new RegExp(`^(SELECT|WITH)${AFTER}`, "i").test(body)) {
    return { ok: false, reason: "Chỉ cho phép query bắt đầu bằng SELECT hoặc WITH." };
  }

  if (body.includes(";")) {
    return { ok: false, reason: "Chỉ cho phép một câu lệnh duy nhất (không dùng ';' để nối nhiều câu lệnh)." };
  }

  for (const { label, regex } of BLOCKED_PATTERNS) {
    if (regex.test(body)) {
      return {
        ok: false,
        reason:
          `Query bị từ chối vì chứa từ khóa không được phép: ${label}. ` +
          "read_query chỉ chạy một câu SELECT/WITH thuần đọc (không SELECT ... INTO). " +
          "Nếu đây là tên cột/bảng, hãy đặt trong dấu ngoặc vuông, ví dụ [Set].",
      };
    }
  }

  return { ok: true };
}
