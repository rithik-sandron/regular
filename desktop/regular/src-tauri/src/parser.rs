use crate::node::Node;
use crate::renderer::render;
use std::{
    fs::File,
    io::{BufRead, BufReader},
};

const CHARS: usize = 10_000;
const NEW_LINE: u8 = b'\n';
const TAB: u8 = b'\t';
const SPACE: u8 = b' ';
const TYPE: &str = "p";
const EMPTY_TYPE: &str = "br";

pub fn parse() -> std::io::Result<String> {
    let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/note.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/student.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/lecturer.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/project.md";
    let file = File::open(path)?;
    let mut order = 1;
    let mut level = 0.0;
    let mut s: String = String::from("");
    let mut reader = BufReader::with_capacity(CHARS, file);

    let mut root = Node {
        _text: String::from(""),
        _md_text: String::from(""),
        _skimmedText: String::from(""),
        _type: "h1".to_string(),
        _charStart: 0,
        _charEnd: 0,
        _level: 0.0,
        _indent: 0.0,
        _order: order,
        // _order: date1 !== null ? 3 * order++ : 0,
        _isRoot: true,
        _pad: 8.03,
        _date1: "".to_string(),
        _date2: "".to_string(),
        _isUpdated: false,
        _id: Node::count(),
        _firstChild: Default::default(),
        _nextSibling: Default::default(),
        _color: String::new(),
        _min_date: 0,
        _max_date: 0,
        _has_dates: false
    };

    order += 1;
    let mut prev = &mut root;
    let mut is_true: bool = true;
    let mut is_indended = false;

    let mut min_date= 0; 
    let mut max_date = 0;
    let mut _has_dates = false;

    loop {
        let buffer = reader.fill_buf()?;
        let buffer_length = buffer.len();
        // BufRead could not read any bytes.
        // The file must have completely been read.
        if buffer_length == 0 {
            break;
        }

        for c in buffer {
            if !is_indended && (c != &SPACE && c != &TAB) {
                is_indended = true;
            }

            if &NEW_LINE == c {
                // is root
                let (md_text, skimmed_text, date1, date2, pad, color, min, max) = render(&s, min_date, max_date);
                min_date = min;
                max_date = max;
                let mut _odr = 0;
                let mut _type: &str;
                let mut has_date: bool = false;

                if s.trim().is_empty() {
                    _type = EMPTY_TYPE;
                } else {
                    _type = TYPE;
                }

                if date1 != "" {
                    _odr = 3 * order;
                    order += 1;
                    has_date = true;

                    if !_has_dates {
                        _has_dates = true;
                    }
                }
                if is_true {
                    prev._text = String::from(&s);
                    prev._md_text = String::from(&s);
                    prev._skimmedText = String::from(&s);
                    prev._order = _odr;
                    is_true = false;

                } else if level == prev._level {
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(md_text),
                        _skimmedText: String::from(skimmed_text),
                        _type: _type.to_string(),
                        _charStart: 0,
                        _charEnd: 0,
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _isRoot: false,
                        _pad: pad,
                        _date1: date1,
                        _date2: date2,
                        _isUpdated: false,
                        _id: Node::count(),
                        _firstChild: Default::default(),
                        _nextSibling: Default::default(),
                        _color: color,
                        _min_date: 0,
                        _max_date: 0,
                        _has_dates: has_date
                    };
                    if prev._isRoot {
                        prev._firstChild = Some(Box::new(current));
                        prev = prev._firstChild.as_mut().unwrap();
                    } else {
                        prev._nextSibling = Some(Box::new(current));
                        prev = prev._nextSibling.as_mut().unwrap();
                    }
                } else if level > prev._level {
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(md_text),
                        _skimmedText: String::from(skimmed_text),
                        _type: TYPE.to_string(),
                        _charStart: 0,
                        _charEnd: 0,
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        // _order: date1 !== null ? 3 * order++ : 0,
                        _isRoot: false,
                        _pad: pad,
                        _date1: date1,
                        _date2: date2,
                        _isUpdated: false,
                        _id: Node::count(),
                        _firstChild: Default::default(),
                        _nextSibling: Default::default(),
                        _color: color,
                        _min_date: 0,
                        _max_date: 0,
                        _has_dates: has_date
                    };
                    prev._firstChild = Some(Box::new(current));
                    prev = prev._firstChild.as_mut().unwrap();
                } else if level < prev._level {
                    prev = check(&mut root, level);
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(md_text),
                        _skimmedText: String::from(skimmed_text),
                        _type: _type.to_string(),
                        _charStart: 0,
                        _charEnd: 0,
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _isRoot: false,
                        _pad: pad,
                        _date1: date1,
                        _date2: date2,
                        _isUpdated: false,
                        _id: Node::count(),
                        _firstChild: Default::default(),
                        _nextSibling: Default::default(),
                        _color: color,
                        _min_date: 0,
                        _max_date: 0,
                        _has_dates: has_date
                    };
                    prev._nextSibling = Some(Box::new(current));
                    prev = prev._nextSibling.as_mut().unwrap();
                }
                s.clear();
                level = 0.0;
                is_indended = false;
                has_date = false;
            } else {
                if !is_indended {
                    if &TAB == c {
                        level = level + 1.0;
                    } else if &SPACE == c {
                        level = level + 0.25;
                    }
                } else {
                    s.push(*c as char);
                }
            }
        }

        // All bytes consumed from the buffer
        // should not be read again.
        reader.consume(buffer_length);
    }
    root._order = order;
    root._min_date = min_date;
    root._max_date = max_date;
    root._has_dates = _has_dates;
    // root.list(String::from("root"));
    Ok(serde_json::to_string(&root)?)
}

pub fn check(mut n: &mut Node, level: f32) -> &mut Node {
    while n._level != level || n._isRoot {
        if n._level <= level {
            n = n._firstChild.as_mut().unwrap();
        }
    }

    while n._nextSibling.is_some() {
        n = n._nextSibling.as_mut().unwrap();
    }
    n
}
