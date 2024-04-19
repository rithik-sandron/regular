use crate::node::Node;
use std::cell::RefCell;
use std::{
    fs::File,
    io::{BufRead, BufReader},
};

const CHARS: usize = 10_000;
const NEW_LINE: u8 = b'\n';
const TAB: u8 = b'\t';
const TYPE: &str = "p";
const EMPTY_TYPE: &str = "br";

pub fn parse() -> std::io::Result<()> {
    let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test.md";
    let file = File::open(path)?;
    let prev = RefCell::new(Node {
        _text: String::from(""),
        _md_text: String::from(""),
        _skimmedText: String::from(""),
        _type: "h1".to_string(),
        _charStart: 0,
        _charEnd: 0,
        _level: 0,
        _indent: 0.0,
        _order: 0,
        // _otder: date1 !== null ? 3 * order++ : 0,
        _isRoot: true,
        _pad: 0,
        _date1: "".to_string(),
        _date2: "".to_string(),
        _isUpdated: false,
        _id: Node::count(),
        _firstChild: Default::default(),
        _nextSibling: Default::default(),
    });
    let root = RefCell::clone(&prev);
    let order = 1;
    let mut level = 0;
    let mut s: String = String::from("");
    let mut reader = BufReader::with_capacity(CHARS, file);

    loop {
        let buffer = reader.fill_buf()?;
        let buffer_length = buffer.len();
        // BufRead could not read any bytes.
        // The file must have completely been read.
        if buffer_length == 0 {
            break;
        }

        buffer.into_iter().for_each(|&c| {
            if &NEW_LINE == &c {
                // is root
                // const [md_text, skimmedText, pad, date1, date2] = render(s);

                if level == prev.borrow()._level {
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(&s),
                        _skimmedText: String::from(&s),
                        _type: "p".to_string(),
                        _charStart: 0,
                        _charEnd: 0,
                        _level: level,
                        _indent: level as f32 * 1.4,
                        _order: 0,
                        // _otder: date1 !== null ? 3 * order++ : 0,
                        _isRoot: false,
                        _pad: 0,
                        _date1: "".to_string(),
                        _date2: "".to_string(),
                        _isUpdated: false,
                        _id: Node::count(),
                        _firstChild: Default::default(),
                        _nextSibling: Default::default(),
                    };
                    if prev.borrow()._isRoot {
                        prev.borrow_mut().child(&current);
                    } else {
                        prev.borrow_mut().sibling(&current);
                    }
                    prev.replace(current);
                }
                s.clear();
                level = 0;
            } else {
                if &TAB == &c {
                    level = level + 1;
                } else {
                    s.push(c as char);
                }
            }
        });

        // All bytes consumed from the buffer
        // should not be read again.
        reader.consume(buffer_length);
    }
    root.clone().into_inner().list();
    Ok(())
}
