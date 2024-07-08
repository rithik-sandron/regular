// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![recursion_limit = "256"]
use std::env;
use tauri::Manager;

pub mod db;
pub mod file;
pub mod node;
pub mod parser;
pub mod root;
pub mod uuid;

// #[tauri::command]
// fn parse() -> String {
//     // let _ = db::create_file(&raw_name, &raw_string, &json);
//     let (raw_name, raw_string, tree) = parser::parse().expect("paring error");
//     let json = serde_json::to_string(&tree).expect("conversion error");
//     json
// }

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // run when app initializes
            db::init().expect("Failed to initialize database");

            // run when app closes TODO:this is not working
            let window = _app.get_window("main").unwrap();
            window.on_window_event(|event| {
                if let tauri::WindowEvent::CloseRequested { .. } = event {
                    db::close();
                    println!("Window is closing, performing cleanup...");
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_file, get_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_file(id: u64) -> file::File {
    let file = db::get_file(id).unwrap();
    file
}

#[tauri::command]
fn get_files() -> Vec<file::FileMeta> {
    // let formatted_name = file_stem.replace(' ', "-");
    let files = db::get_files().unwrap();
    files
}
