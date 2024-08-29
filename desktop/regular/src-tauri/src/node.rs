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

    pub fn find_node_by_id(&mut self, target_id: u128, text: String, level: f32) -> bool {
        if self._id == target_id {
            self._text = text;
            self._level = level; 
            println!("{:?}", self._text);
            return true; 
        }

        if self._first_child.is_some() && self._first_child.as_mut().unwrap().find_node_by_id(target_id, text.clone(), level) {
            return true;
        }

        if self._next_sibling.is_some() {
            let mut current_sibling = self._next_sibling.as_mut().unwrap();
            loop {
                if current_sibling.find_node_by_id(target_id, text.clone(), level) {
                    return true;
                }
                current_sibling = current_sibling._next_sibling.as_mut().unwrap();
            }
        } else {
            return false;
        }
    }
}