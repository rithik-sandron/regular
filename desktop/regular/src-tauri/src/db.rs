use crate::{
    file::{File, FileMeta},
    parser,
};
use chrono::Local;
use rusqlite::{Connection, Result};

static mut CONN: Option<Connection> = None;

fn get_db() -> String {
    "/Users/azula/code/rithik/regular/desktop/regular/db/data.db".to_string()
}

fn open() -> Result<()> {
    // Initialize the global connection
    Ok(unsafe {
        CONN = Some(Connection::open(get_db())?);
    })
}

pub fn close() {
    unsafe {
        if let Some(conn) = CONN.take() {
            conn.close().expect("Failed to close connection");
        }
    }
}

pub fn init() -> Result<()> {
    let _ = open();
    unsafe {
        // Create a new database connection
        // CONN.as_ref().unwrap().execute("DROP TABLE file", [])?;

        // Create a new table
        CONN.as_ref().unwrap().execute(
            "CREATE TABLE IF NOT EXISTS file (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    raw TEXT,
                    markdown TEXT
                    modified_date DATE DEFAULT CURRENT_DATE)",
            [],
        )?;
    }
    // let _ = create_file("hello", "hello", "hello");
    // let _ = get_file(unsafe { CONN.as_ref().unwrap().last_insert_rowid().to_string() });
    // parse();
    println!("{}", "Migration done");
    Ok(())
}

pub fn create_file(name: &str, raw: &str, markdown: &str) -> Result<(), String> {
    let mut stmt = unsafe {
        CONN.as_ref()
            .unwrap()
            .prepare("INSERT INTO file (name, raw, markdown, modified_date) VALUES (?1, ?2, ?3, ?4)")
            .map_err(|e| e.to_string())
    }?;

    stmt.execute([name, raw, markdown, &Local::now().naive_local().to_string()])
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_files() -> Result<Vec<FileMeta>, String> {
    let mut stmt = unsafe {
        CONN.as_ref()
            .unwrap()
            .prepare("SELECT id, name, modified_date FROM file")
            .map_err(|e| e.to_string())
    }?;

    let iter = stmt
        .query_map([], |row| {
            Ok(FileMeta {
                id: row.get(0)?,
                name: row.get(1)?,
                modified_date: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let file: Result<Vec<_>, _> = iter.collect();
    file.map_err(|err| err.to_string())
}

pub fn get_file(id: u64) -> Result<File> {
    unsafe {
        let file: File = CONN.as_ref().unwrap().query_row(
            "SELECT id, name, raw, markdown FROM file WHERE id = ?1",
            [&id],
            |row| {
                let id: u64 = row.get(0)?;
                let name: String = row.get(1)?;
                let raw: String = row.get(2)?;
                let markdown: String = row.get(3)?;
                Ok(File {
                    id,
                    name,
                    raw,
                    markdown,
                })
            },
        )?;
        Ok(file)
    }
}

fn parse() {
    let (raw_name, raw_string, tree) = parser::parse().expect("paring error");
    let json = serde_json::to_string(&tree).expect("conversion error");
    let _ = create_file(&raw_name, &raw_string, &json);
}
