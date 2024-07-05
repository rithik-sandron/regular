// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![recursion_limit = "256"]
use std::{env, fs, path::Path};

pub mod node;
pub mod root;

mod parser;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_doc, get_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_doc() -> String {
    let tree = parser::parse();
    // get_files();
    // println!("{}", tree.expect("paring error"));
    serde_json::to_string(&tree.expect("paring error")).expect("conversion error")
}

#[tauri::command]
fn get_files() -> Vec<std::string::String> {
    let mut files: Vec<String> = Vec::new();
    if let Ok(entries) = fs::read_dir(parser::get_dir()) {
        for entry in entries.filter_map(Result::ok) {
            if entry.file_type().map(|ft| ft.is_file()).unwrap_or(false) {
                if let Ok(file_name) = entry.file_name().into_string() {
                    if !file_name.starts_with('.') {
                        let file_stem = Path::new(&file_name)
                            .file_stem()
                            .and_then(|s| s.to_str())
                            .unwrap_or("");
                        // Replace spaces with -
                        let formatted_name = file_stem.replace(' ', "-");
                        files.push(formatted_name);
                    }
                }
            }
        }
    }
    files
}
