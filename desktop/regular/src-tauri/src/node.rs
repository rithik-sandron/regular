use serde::{Deserialize, Serialize};

use crate::parser::parse_content;

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
        if self._first_child.is_some() {
            self._first_child.clone().unwrap().list();
        }
        if self._next_sibling.is_some() {
            self._next_sibling.clone().unwrap().list();
        }
    }

    pub fn find_node_by_id(&mut self, target_id: u128, text: &str, level: f32) -> bool {
        // println!("targetId: {}, self Id: {}", target_id, self._id);

        if self._id == target_id {
            self._text = text.to_string();
            self._level = level; 
            (self._md_text, self._skimmed_text, self._date1, self._date2, self._pad) = parse_content(&self._text);
            return true; 
        }

        if self._first_child.is_some() && self._first_child.as_mut().unwrap().find_node_by_id(target_id, &text, level) {
            // println!("child: {}", self._first_child.as_ref().unwrap()._text);
            return true;
        }

        if self._next_sibling.is_some() {
            let mut current_sibling = self._next_sibling.as_mut().unwrap();
            // println!("sibling: {}", current_sibling._text);

            loop {
                if current_sibling.find_node_by_id(target_id, &text, level) {
                    return true;
                }
                current_sibling = current_sibling._next_sibling.as_mut().unwrap();
            }
        }

        return false;
    }
}