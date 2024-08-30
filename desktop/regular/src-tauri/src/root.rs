use crate::node::Node;
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct Root {
    // data (type string, char)
    pub _id: u128,
    pub _uid: u128,
    pub _text: String,

    // N-ary tree (type: Node)
    pub _level: f32,
    pub _indent: f32,
    pub _order: u32,
    pub _first_child: Option<Box<Node>>,
    pub _is_updated: bool,

    //timline
    pub _color: String,
    pub _min_date: u32,
    pub _max_date: u32,
    pub _has_dates: bool,
}

impl Root {
    pub fn list(&self) {
        if self._first_child.is_some() {
            self._first_child.clone().unwrap().list();
        }
    }
}
