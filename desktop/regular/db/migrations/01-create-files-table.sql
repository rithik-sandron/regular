CREATE TABLE IF NOT EXISTS file (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    raw TEXT,
    markdown TEXT
    modified_date DATE DEFAULT CURRENT_DATE)

ALTER TABLE file ADD COLUMN modified_date DATE;

UPDATE file SET modified_date = DATE('now');
