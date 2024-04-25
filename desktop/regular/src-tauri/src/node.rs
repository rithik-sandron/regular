use serde::{Deserialize, Serialize};

static mut UUID: u128 = 0;

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
pub struct Node {
    // data (type string, char)
    pub _id: u128,
    pub _text: String,
    pub _md_text: String,
    pub _skimmedText: String,
    pub _type: String,
    pub _charStart: u32,
    pub _charEnd: u32,

    // N-ary tree (type: Node)
    pub _level: f32,
    pub _indent: f32,
    pub _order: u32,
    pub _isRoot: bool,
    pub _firstChild: Option<Box<Node>>,
    pub _nextSibling: Option<Box<Node>>,
    // dates
    pub _pad: f64,
    pub _date1: String,
    pub _date2: String,
    pub _isUpdated: bool,

    //timline
    pub _color: String,
    pub _min_date: u32,
    pub _max_date: u32,
    pub _has_dates: bool,
}

impl Node {
    pub fn count() -> u128 {
        unsafe {
            UUID += 1;
            UUID
        }
    }

    pub fn new(
        &mut self,
        isRoot: bool,
        level: f32,
        indent: f32,
        text: String,
        md_text: String,
        skimmedText: String,
        node_type: String,
        start: u32,
        end: u32,
        pad: f64,
        date1: String,
        date2: String,
        order: u32,
        color: String,
        min_date: u32,
        max_date: u32,
        has_date: bool,
    ) -> Node {
        Node {
            _id: Self::count(),
            _isRoot: isRoot,
            _level: level,
            _indent: indent,
            _text: text,
            _md_text: md_text,
            _skimmedText: skimmedText,
            _type: node_type,
            _charStart: start,
            _charEnd: end,
            _pad: pad,
            _date1: date1,
            _date2: date2,
            _order: order,
            _isUpdated: false,
            // children
            _firstChild: None,
            _nextSibling: None,
            _color: color,
            _min_date: min_date,
            _max_date: max_date,
            _has_dates: has_date,
        }
    }

    // pub fn sibling(&mut self, elem: Node) {
    //     match self._nextSibling {
    //         address::address(ref mut ns) => {
    //             ns.sibling(elem);
    //         }
    //         address::Nil => {
    //             let node = elem;
    //             self._nextSibling = address::address(Box::new(node))
    //         }
    //     }
    // }

    // pub fn child(&mut self, elem: Node) {
    //     match self._firstChild {
    //         address::address(ref mut ns) => {
    //             ns.child(elem);
    //         }
    //         address::Nil => {
    //             let node = elem;
    //             self._firstChild = address::address(Box::new(node))
    //         }
    //     }
    // }

    pub fn list(self, w: String) {
        println!("{:?}", self);
        if self._firstChild.is_some() {
            self._firstChild.unwrap().list(String::from("child"));
        }
        if self._nextSibling.is_some() {
            self._nextSibling.unwrap().list(String::from("sibling"));
        }
    }
}
