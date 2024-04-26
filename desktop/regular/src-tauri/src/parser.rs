use crate::node::Node;
use crate::renderer::render;
use crate::root::Root;
use std::{
    fs::File,
    io::{BufRead, BufReader},
};

const CHARS: usize = 10_000;
const NEW_LINE: u8 = b'\n';
const TAB: u8 = b'\t';
const SPACE: u8 = b' ';
const HEAD_TYPE: &str = "h1";
const TYPE: &str = "p";
const EMPTY_TYPE: &str = "br";

pub fn parse() -> std::io::Result<String> {
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/srcs-tauri/src/test/note.md";
    let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/student.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/lecturer.md";
    let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/project.md";
    let file = File::open(path)?;
    let mut order = 1;
    let mut level = 0.0;
    let mut s: String = String::from("");
    let mut reader = BufReader::with_capacity(CHARS, file);

    let mut root = Root {
        _id: 0,
        _text: String::from(""),
        _type: HEAD_TYPE.to_string(),
        _level: 0.0,
        _indent: 0.0,
        _order: 0,
        _is_updated: false,
        _first_child: Some(Box::new(Node {
            _text: String::from(""),
            _md_text: String::from(""),
            _skimmed_text: String::from(""),
            _type: TYPE.to_string(),
            _level: level,
            _indent: level * 1.8,
            _order: 0,
            _pad: 0.0,
            _date1: String::new(),
            _date2: String::new(),
            _is_updated: false,
            _id: Node::count(),
            _first_child: Default::default(),
            _next_sibling: Default::default(),
            _color: String::new(),
            _has_dates: false,
        })),
        _color: String::new(),
        _min_date: 0,
        _max_date: 0,
        _has_dates: false,
    };

    order += 1;
    let mut prev: &mut Node = &mut root._first_child.as_mut().unwrap();
    let mut is_first_itr: bool = true;
    let mut is_indended = false;

    let mut min_date = 0;
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
                let (md_text, skimmed_text, date1, date2, pad, color, min, max) =
                    render(&s, min_date, max_date);
                min_date = min;
                max_date = max;
                let mut _odr = 0;
                let mut _type: String;
                let mut has_date: bool = false;

                if s.trim().is_empty() {
                    _type = EMPTY_TYPE.to_string();
                } else {
                    _type = TYPE.to_string();
                }

                if date1 != "" {
                    _odr = 3 * order;
                    order += 1;
                    has_date = true;

                    if !_has_dates {
                        _has_dates = true;
                    }
                }

                if is_first_itr {
                    prev._text = String::from(&s);
                    prev._md_text = String::from(&md_text);
                    prev._skimmed_text = String::from(&skimmed_text);
                    prev._type = HEAD_TYPE.to_string();
                    prev._level = level;
                    prev._indent = level * 1.8;
                    prev._order = _odr;
                    prev._pad = pad;
                    prev._date1 = date1.clone();
                    prev._date2 = date2.clone();
                    prev._is_updated = false;
                    prev._id = Node::count();
                    prev._first_child = Default::default();
                    prev._next_sibling = Default::default();
                    prev._color = color.clone();
                    prev._has_dates = has_date;
                    is_first_itr = false;
                } else if level == prev._level {
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(md_text),
                        _skimmed_text: String::from(skimmed_text),
                        _type: _type.clone(),
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _pad: pad,
                        _date1: date1,
                        _date2: date2,
                        _is_updated: false,
                        _id: Node::count(),
                        _first_child: Default::default(),
                        _next_sibling: Default::default(),
                        _color: color,
                        _has_dates: has_date,
                    };
                    prev._next_sibling = Some(Box::new(current));
                    prev = prev._next_sibling.as_mut().unwrap();
                } else if level > prev._level {
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(&md_text),
                        _skimmed_text: String::from(&skimmed_text),
                        _type: _type.clone(),
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _pad: pad,
                        _date1: date1,
                        _date2: date2,
                        _is_updated: false,
                        _id: Node::count(),
                        _first_child: Default::default(),
                        _next_sibling: Default::default(),
                        _color: color,
                        _has_dates: has_date,
                    };
                    prev._first_child = Some(Box::new(current));
                    prev = prev._first_child.as_mut().unwrap();
                } else if level < prev._level {
                    prev = check_root(&mut root, level);
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(&md_text),
                        _skimmed_text: String::from(&skimmed_text),
                        _type: _type.clone(),
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _pad: pad,
                        _date1: date1,
                        _date2: date2,
                        _is_updated: false,
                        _id: Node::count(),
                        _first_child: Default::default(),
                        _next_sibling: Default::default(),
                        _color: color,
                        _has_dates: has_date,
                    };
                    prev._next_sibling = Some(Box::new(current));
                    prev = prev._next_sibling.as_mut().unwrap();
                }
                s.clear();
                level = 0.0;
                is_indended = false;
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
    // root.list();
    Ok(serde_json::to_string(&root)?)
}

fn check_root(r: &mut Root, level: f32) -> &mut Node {
    check_node(r._first_child.as_mut().unwrap(), level)
}

fn check_node(mut n: &mut Node, level: f32) -> &mut Node {
    while n._level != level {
        if n._level <= level {
            n = n._first_child.as_mut().unwrap();
        }
    }

    while n._next_sibling.is_some() {
        n = n._next_sibling.as_mut().unwrap();
    }
    n
}
