// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![recursion_limit = "256"]
use std::env;
pub mod node;
pub mod root;

mod parser;
mod renderer;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_doc])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_doc() -> String {
    let tree = parser::parse();
    // println!("{}", tree.expect("paring error"));
    tree.expect("paring error")
}
