// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![recursion_limit = "256"]
use std::{collections::BTreeMap, env};
use db::update_file;
use root::Root;
use tauri::Manager;

pub mod db;
pub mod file;
pub mod node;
pub mod parser;
pub mod mutation;
pub mod root;
pub mod uuid;

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
        .invoke_handler(tauri::generate_handler![get_file, get_files, get_latest_file, create_doc, save])
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
    db::get_files().unwrap()
}

#[tauri::command]
fn create_doc() {
    db::create_doc();
}

#[tauri::command]
fn get_latest_file()-> file::FileMeta {
    db::get_latest_file().unwrap()
}

#[tauri::command]
fn save(mutate: BTreeMap<String, mutation::Mutation>, id: &str, name: &str, raw: String, markdown: String) -> String {
    let mut root: Root = serde_json::from_str(&markdown).expect("parsing error");
    for (key, value) in mutate.iter() {
        let key_id: u128 = key.parse().unwrap();
        // println!("{}={}={}={}", key_id, value.parentId, &value.text, value.level);
        if value.action == "update" {
            let res = root._first_child.as_mut().unwrap().find_node_by_id_and_update(key_id, &value.text, value.level, root._min_date, root._max_date, root._has_dates);
            if res.0 {
                root._min_date = res.1;
                root._max_date = res.2;
                root._has_dates = res.3;
            }
        }

        if value.action == "add" {
            let res = root._first_child.as_mut().unwrap().find_node_by_id_and_create(key_id, value.parentId.parse().unwrap(), &value.text, value.level, root._min_date, root._max_date, root._has_dates);
            if res.0 {
                root._min_date = res.1;
                root._max_date = res.2;
                root._has_dates = res.3;
            }
        }

        if value.action == "delete" {
            // root._first_child.as_mut().unwrap().find_node_by_id_and_delete(key_id);
        }
    }
    
    let json = serde_json::to_string(&root).expect("conversion error");
    let _ = update_file(id, name, &raw, &json);
    json
}