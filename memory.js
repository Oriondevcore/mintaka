import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';

// ── SETUP ─────────────────────────────────────
mkdirSync('./data', { recursive: true });

const db = new Database('./data/mintaka.db');
db.exec('PRAGMA journal_mode = WAL');

console.log('💾 Memory ready — bun:sqlite (Enhanced with Knowledge Base)');

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
  
  CREATE TABLE IF NOT EXISTS knowledge (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    ts       DATETIME DEFAULT CURRENT_TIMESTAMP,
    fact     TEXT NOT NULL,
    category TEXT DEFAULT 'general'
  );

  CREATE INDEX IF NOT EXISTS idx_sender ON messages(sender);
  CREATE INDEX IF NOT EXISTS idx_ts     ON messages(ts);
`);

// ── SAVE MESSAGE ──────────────────────────────
export function saveMessage(sender, name, role, content) {
  try {
    db.prepare(`INSERT INTO messages (sender, name, role, content) VALUES (?, ?, ?, ?)`).run(sender, name, role, content);
  } catch (err) {
    console.error('Memory save error:', err.message);
  }
}

// ── SAVE KNOWLEDGE (Learning) ──────────────────
export function saveFact(fact, category = 'business') {
  try {
    db.prepare(`INSERT INTO knowledge (fact, category) VALUES (?, ?)`).run(fact, category);
    return true;
  } catch (err) {
    console.error('Knowledge save error:', err.message);
    return false;
  }
}

// ── SEARCH KNOWLEDGE (RAG) ─────────────────────
export function getRelevantKnowledge(query) {
  try {
    // Basic search: gets the 5 most recent facts. 
    // In a more advanced version, we would use vector embeddings.
    const facts = db.prepare(`SELECT fact FROM knowledge ORDER BY ts DESC LIMIT 5`).all();
    return facts.map(f => f.fact).join('\n');
  } catch (err) {
    return "";
  }
}

// ── GET HISTORY ───────────────────────────────
export function getHistory(sender, limit = 10) {
  try {
    const rows = db.prepare(`SELECT role, content FROM messages WHERE sender = ? ORDER BY ts DESC LIMIT ?`).all(sender, limit);
    return rows.reverse();
  } catch (err) {
    return [];
  }
}
