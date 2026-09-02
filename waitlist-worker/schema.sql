CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL,
  source TEXT,
  name TEXT,
  oabs TEXT,
  area TEXT,
  lawyers TEXT,
  caseload TEXT
);
