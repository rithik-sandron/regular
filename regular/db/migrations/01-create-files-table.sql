CREATE TABLE IF NOT EXISTS file (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    raw TEXT,
    markdown TEXT
    modified_date DATE DEFAULT CURRENT_DATE)

SELECT id FROM file;

ALTER TABLE file ADD COLUMN modified_date DATE;

UPDATE file SET modified_date = DATE('now');

UPDATE file SET modified_date = DATE('now') where id = 5;

DELETE FROM file WHERE id = 2;

SELECT id, name, markdown FROM file ORDER BY id DESC LIMIT 1;

sqlite3
.open /Users/azula/code/rithik/regular/desktop/regular/db/data.db
.open /Users/ryuu/code/repo/regular/regular/db/data.db