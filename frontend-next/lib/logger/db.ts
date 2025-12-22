import Database from "better-sqlite3";
import path from "path";

// Self-hosting tip: Store outside .next folder so it persists across rebuilds
const dbPath = path.resolve(process.cwd(), "app-logs.db");

export const db = new Database(dbPath);

// 1. Initialize Table
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    level TEXT,
    message TEXT,
    session_id TEXT,
    user_id TEXT,
    request_id TEXT,
    metadata TEXT
  );

  CREATE TABLE IF NOT EXISTS identities (
    user_id TEXT PRIMARY KEY,
    traits TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// 2. Initialize Auto-Cleanup Trigger (The "Cap")
// Keeps only the last 10,000 rows. Runs automatically on every insert.
db.exec(`
  CREATE TRIGGER IF NOT EXISTS cap_logs_size
  AFTER INSERT ON logs
  BEGIN
    DELETE FROM logs
    WHERE id <= (SELECT id FROM logs ORDER BY id DESC LIMIT 1 OFFSET 10000);
  END;
`);
