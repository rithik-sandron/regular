use std::mem;

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

    pub fn find_node_by_id_and_delete(&mut self, target_id: u128) -> bool {
        if self._id == target_id {
            if self._first_child.is_some() {
                self._prev_sibling.as_mut().unwrap()._next_sibling = self._first_child.clone();  
                self._first_child.as_mut().unwrap()._prev_sibling = self._prev_sibling.clone();  
            } else if self._next_sibling.is_some() {
                self._prev_sibling.as_mut().unwrap()._next_sibling = self._next_sibling.clone();  
                self._next_sibling.as_mut().unwrap()._prev_sibling = self._prev_sibling.clone();  
            }
            mem::drop(self);
            return true; 
        }

        if self._first_child.is_some() && self._first_child.as_mut().unwrap().find_node_by_id_and_delete(target_id) {
            return true;
        }

        if self._next_sibling.is_some() {
            let mut current_sibling = self._next_sibling.as_mut().unwrap();

            loop {
                if current_sibling.find_node_by_id_and_delete(target_id) {
                    return true;
                } else {
                    if current_sibling._next_sibling.is_some() {
                        current_sibling = current_sibling._next_sibling.as_mut().unwrap();
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return false;
    }

    pub fn find_node_by_id_and_update(&mut self, target_id: u128, text: &str, level: f32, mut min_date: u32, mut max_date: u32) -> (bool, u32, u32) {
        if self._id == target_id {
            self._text = text.to_string();
            self._level = level; 
            (self._md_text, self._skimmed_text, self._date1, self._date2, self._pad, min_date, max_date) = parse_content(&self._text, min_date, max_date);
            return (true, min_date, max_date); 
        }

        if self._first_child.is_some() {
            let res = self._first_child.as_mut().unwrap().find_node_by_id_and_update(target_id, &text, level, min_date, max_date);
            if res.0 {
                return res;
            }
        }

        if self._next_sibling.is_some() {
            let mut current_sibling = self._next_sibling.as_mut().unwrap();

            loop {
                let res = current_sibling.find_node_by_id_and_update(target_id, &text, level, min_date, max_date);
                if res.0 {
                    return res;
                } else {
                    if current_sibling._next_sibling.is_some() {
                        current_sibling = current_sibling._next_sibling.as_mut().unwrap();
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return (false, min_date, max_date);
    }

    pub fn find_node_by_id_and_create(&mut self, key_id: u128, target_id: u128, text: &str, level: f32, mut min_date: u32, mut max_date: u32) 
    -> (bool, u32, u32) {
        if self._id == target_id {
            let mut current = Node {
                _text: String::from(text.to_string()),
                _md_text: String::new(),
                _skimmed_text: String::new(),
                _type: "p".to_string(),
                _level: level,
                _indent: (level * 1.8),
                _order: 0,
                _pad: 0,
                _date1: String::new(),
                _date2: String::new(),
                _is_updated: false,
                _id: key_id,
                _first_child: None,
                _next_sibling: None,
                _prev_sibling: Some(Box::new(self.clone())),
                _color: String::new(),
                _has_dates: false,
            };
            (current._md_text, current._skimmed_text, current._date1, current._date2, current._pad, min_date, max_date) = parse_content(text, min_date, max_date);
            current._has_dates = !current._date1.is_empty();
            current._next_sibling = self._next_sibling.clone();
            current._first_child = self._first_child.clone();
            self._next_sibling = Some(Box::new(current));
            self._first_child = None;
            return (true, min_date, max_date); 
        }

        if self._first_child.is_some() {
            let res = self._first_child.as_mut().unwrap().find_node_by_id_and_create(key_id, target_id, &text, level, min_date, max_date);
            if res.0 {
                return res;
            }
        }

        if self._next_sibling.is_some() {
            let mut current_sibling = self._next_sibling.as_mut().unwrap();
            loop {
                let res = current_sibling.find_node_by_id_and_create(key_id, target_id, &text, level, min_date, max_date);
                if res.0{
                    return res;
                } else {
                    if current_sibling._next_sibling.is_some() {
                        current_sibling = current_sibling._next_sibling.as_mut().unwrap();
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return (false, min_date, max_date);
    }
}