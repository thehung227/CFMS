import { test } from "node:test";
import assert from "node:assert/strict";
import { validateReadOnlyQuery } from "./sql-guard.js";

const allowed = [
  "SELECT 1",
  "select top 10 * from dbo.Users",
  "  SELECT COUNT(*) FROM dbo.Orders WHERE Status = 1;  ",
  "WITH cte AS (SELECT Id FROM dbo.T) SELECT * FROM cte",
  ";WITH cte AS (SELECT 1 AS x) SELECT x FROM cte;",
  "-- comment\nSELECT 1",
  "/* header */ SELECT 1",
  "SELECT 'DELETE FROM x; DROP TABLE y' AS txt",
  "SELECT N'it''s UPDATE' AS txt",
  "SELECT [Update], [Set], \"Delete\" FROM dbo.T",
  "SELECT UpdatedDate, CreatedBy, IsDeleted, Settings FROM dbo.T",
  "SELECT a, COUNT(*) FROM dbo.T GROUP BY GROUPING SETS ((a), ())",
  "SELECT * FROM dbo.T OPTION (USE HINT('DISABLE_OPTIMIZER_ROWGOAL'))",
  "SELECT * FROM dbo.T WITH (NOLOCK) WHERE Name LIKE N'%exec%'",
];

const rejected = [
  "",
  "UPDATE dbo.T SET a = 1",
  "DELETE FROM dbo.T",
  "INSERT INTO dbo.T VALUES (1)",
  "MERGE dbo.T AS t USING dbo.S AS s ON 1=0 WHEN NOT MATCHED THEN INSERT (a) VALUES (1);",
  "TRUNCATE TABLE dbo.T",
  "DROP TABLE dbo.T",
  "EXEC dbo.usp_Report",
  "SELECT * INTO dbo.Copy FROM dbo.T",
  "SELECT 1; DROP TABLE dbo.T",
  "SELECT 1 EXEC('DROP TABLE dbo.T')",
  "SELECT 1 UPDATE dbo.T SET a = 1",
  "SELECT 1UPDATE dbo.T SET a = 1",
  "WITH c AS (SELECT Id FROM dbo.T) DELETE FROM c",
  "SELECT 1 /* /* */ DROP TABLE dbo.T */",
  "SELECT 1 /* never closed",
  "SELECT 'unterminated",
  "SELECT 1 --x\rDROP TABLE dbo.T",
  "SELECT 1 WAITFOR DELAY '00:10:00'",
  "SELECT * FROM OPENROWSET(BULK 'C:\\x.txt', SINGLE_CLOB) AS x",
  "SELECT * FROM OPENQUERY(LinkedSrv, 'SELECT 1')",
  "SELECT NEXT VALUE FOR dbo.MySeq",
  "SELECT 1 USE master",
  "SELECT 1 BEGIN TRAN",
  "SELECT 1 GRANT SELECT ON dbo.T TO public",
  "SELECT 1 DBCC CHECKDB",
  "(SELECT 1)",
  "sp_who",
];

for (const q of allowed) {
  test(`allows: ${JSON.stringify(q)}`, () => {
    assert.deepEqual(validateReadOnlyQuery(q), { ok: true });
  });
}

for (const q of rejected) {
  test(`rejects: ${JSON.stringify(q)}`, () => {
    assert.equal(validateReadOnlyQuery(q).ok, false);
  });
}
