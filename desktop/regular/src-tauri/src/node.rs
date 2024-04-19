static mut UUID: u128 = 0;

#[derive(Default, Debug, Clone)]
pub enum Address {
    Adrs(Box<Node>),
    #[default]
    Nil,
}

#[derive(Debug, Default, Clone)]
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
    pub _level: u32,
    pub _indent: f32,
    pub _order: u32,
    pub _isRoot: bool,
    pub _firstChild: Address,
    pub _nextSibling: Address,
    // dates
    pub _pad: u32,
    pub _date1: String,
    pub _date2: String,
    pub _isUpdated: bool,
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
        level: u32,
        indent: f32,
        text: String,
        md_text: String,
        skimmedText: String,
        node_type: String,
        start: u32,
        end: u32,
        pad: u32,
        date1: String,
        date2: String,
        order: u32,
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
            _firstChild: Address::Nil,
            _nextSibling: Address::Nil,
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

    pub fn child(&mut self, elem: &Node) {
        match self._firstChild {
            Address::Adrs(ref mut ns) => {
                ns.child(elem);
            }
            Address::Nil => {
                let node = elem;
                self._firstChild = Address::Adrs(Box::new(node.clone()));
            }
        }
    }

    pub fn sibling(&mut self, elem: &Node) {
        match self._nextSibling {
            Address::Adrs(ref mut ns) => {
                ns.sibling(elem);
            }
            Address::Nil => {
                let node = elem;
                self._nextSibling = Address::Adrs(Box::new(node.clone()));
            }
        }
    }

    pub fn list(&self) {
        println!("{}", self._text);
        match self._firstChild {
            Address::Adrs(ref n) => n.list(),
            Address::Nil => {}
        }
        // match self._nextSibling {
        //     Address::Adrs(ref n) => n.list(),
        //     Address::Nil => {}
        // }
    }
}
