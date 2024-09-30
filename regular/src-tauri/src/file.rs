use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct File {
    pub id: u64,
    pub name: String,
    pub raw: String,
    pub markdown: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct FileMeta {
    pub id: u64,
    pub name: String,
    pub modified_date: String,
}

