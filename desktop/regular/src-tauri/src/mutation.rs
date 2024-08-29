use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct Mutation {
    #[serde(default)]
    pub action: String,
    
    #[serde(default)]
    pub id: String,
    
    #[serde(default)]
    pub text: String,

    #[serde(default)]
    pub parentId: String,

    #[serde(default)]
    pub level: f32,
}

// Implement Default for MyObject
impl Default for Mutation {
    fn default() -> Self {
        Mutation {
            action: String::new(),
            id: String::new(),
            text: String::new(),
            parentId: String::new(),
            level: 0.0
        }
    }
}