use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct Node {
    // data
    pub _id: u128,
    pub _text: String,
    pub _md_text: String,
    pub _skimmed_text: String,
    pub _type: String,

    // N-ary tree (type: Node)
    pub _level: f32,
    pub _indent: f32,
    pub _order: u32,
    pub _first_child: Option<Box<Node>>,
    pub _next_sibling: Option<Box<Node>>,
    pub _prev_sibling: Option<Box<Node>>,

    // dates
    pub _pad: i64,
    pub _date1: String,
    pub _date2: String,
    pub _is_updated: bool,

    //timeline
    pub _color: String,
    pub _has_dates: bool,
}

impl Node {
    pub fn list(&self) {
        println!("{:?}", self);
        if self._first_child.is_some() {
            self._first_child.clone().unwrap().list();
        }
        if self._next_sibling.is_some() {
            self._next_sibling.clone().unwrap().list();
        }
    }
}
