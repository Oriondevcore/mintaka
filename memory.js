import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';

// ── SETUP ─────────────────────────────────────
mkdirSync('./data', { recursive: true });

const db = new Database('./data/mintaka.db');
db.exec('PRAGMA journal_mode = WAL');

console.log('💾 Memory ready — bun:sqlite (zero dependencies)');

// ── TABLES ────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    ts       DATETIME DEFAULT CURRENT_TIMESTAMP,
    sender   TEXT NOT NULL,
    name     TEXT,
    role     TEXT NOT NULL,
    content  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sender ON messages(sender);
  CREATE INDEX IF NOT EXISTS idx_ts     ON messages(ts);
`);

// ── SAVE MESSAGE ──────────────────────────────
export function saveMessage(sender, name, role, content) {
  try {
    db.prepare(
      `
      INSERT INTO messages (sender, name, role, content)
      VALUES (?, ?, ?, ?)
    `
    ).run(sender, name, role, content);
  } catch (err) {
    console.error('Memory save error:', err.message);
  }
}

// ── GET HISTORY (for AI context) ─────────────
export function getHistory(sender, limit = 8) {
  try {
    const rows = db
      .prepare(
        `
      SELECT role, content FROM messages
      WHERE sender = ?
      ORDER BY ts DESC
      LIMIT ?
    `
      )
      .all(sender, limit);

    return rows.reverse();
  } catch (err) {
    console.error('Memory fetch error:', err.message);
    return [];
  }
}

// ── STATS ─────────────────────────────────────
export function getStats() {
  try {
    const conversations = db
      .prepare('SELECT COUNT(DISTINCT sender) as c FROM messages')
      .get().c;

    const today = db
      .prepare(
        `
      SELECT COUNT(*) as c FROM messages
      WHERE date(ts) = date('now')
    `
      )
      .get().c;

    return { conversations, today };
  } catch {
    return { conversations: 0, today: 0 };
  }
}
