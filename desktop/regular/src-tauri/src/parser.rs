use crate::node::Node;
// use crate::renderer::render;
use crate::root::Root;
use chrono::NaiveDate;

use std::{
    fs::File,
    io::{BufRead, BufReader},
};

const MONTH: [&str; 12] = [
    "Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec",
];

const MARK_START: &str = "<mark className='due-date'>";
const MARK_END: &str = "</mark>";

const CHARS: usize = 10_000;
const NEW_LINE: u8 = b'\n';
const TAB: u8 = b'\t';
const SPACE: u8 = b' ';
const HEAD_TYPE: &str = "h1";
const TYPE: &str = "p";
const EMPTY_TYPE: &str = "br";

pub fn parse() -> std::io::Result<Root> {
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/srcs-tauri/src/test/note.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/student.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/lecturer.md";
    let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/project.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/test.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/sample.md";
    // let path = "/Users/ryuu/code/repo/regular/desktop/regular/src-tauri/src/test/plan.md";

    let file = File::open(path)?;
    let mut order = 1;
    let mut level = 0.0;
    let mut s: String = String::new();
    let mut reader = BufReader::with_capacity(CHARS, file);

    let mut root = Root {
        _id: 0,
        _text: String::new(),
        _level: 0.0,
        _indent: 0.0,
        _order: 0,
        _is_updated: false,
        _first_child: Some(Box::new(Node {
            _text: String::new(),
            _md_text: String::new(),
            _skimmed_text: String::new(),
            _type: TYPE.to_string(),
            _level: level,
            _indent: level * 1.8,
            _order: 0,
            _pad: 0,
            _date1: String::new(),
            _date2: String::new(),
            _is_updated: false,
            _id: Node::count(),
            _first_child: None,
            _next_sibling: None,
            _prev_sibling: None,
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

    let mut date = String::new();
    let mut str = String::new();
    let mut is_date: bool = false;
    let mut is_prev_char: bool = false;
    let mut _has_dates = false;

    let mut skimmed: String = String::new();
    let mut md: String = String::new();
    let mut d_pos_start: usize = 0;
    let mut d_pos_end: usize = 0;
    loop {
        let buffer = reader.fill_buf()?;
        let buffer_length = buffer.len();
        // BufRead could not read any bytes.
        // The file must have completely been read.
        if buffer_length == 0 {
            break;
        }

        for c in buffer {
            let re = b'!';
            let re2 = b'(';
            let re3 = b')';

            if !is_date && c == &re {
                str.push(*c as char);
                is_prev_char = true;
            }

            if is_prev_char && !is_date && c == &re2 {
                is_date = true;
                d_pos_start = s.len() - 1;
            }

            if is_date && re3 != *c {
                str.push(*c as char);
            }

            if is_date && re3 == *c {
                str.push(*c as char);
                date = str.clone();
                str.clear();
                is_date = false;
                d_pos_end = s.len();
            }

            if !is_indended && (c != &SPACE && c != &TAB) {
                is_indended = true;
            }

            if &NEW_LINE == c {
                // let (md_text, skimmed_text, date1, date2, pad, color, min, max) =
                //     render(&s, min_date, max_date);

                let mut pad = 0;
                let color = String::new();

                // convert date to date 1 and 2
                let date1;
                let date2;
                (date1, date2, pad, min_date, max_date) = parse_date(&date, min_date, max_date);
                let mut _odr = 0;
                let mut _type: String;

                if date != "" {
                    if d_pos_end == s.len() - 1 {
                        md = (&s[0..d_pos_start]).to_string()
                            + MARK_START
                            + &s[d_pos_start - 1..d_pos_end + 1]
                            + MARK_END
                            + &s[d_pos_end..s.len() - 1];
                        skimmed = (&s[0..d_pos_start]).to_string() + &s[d_pos_end..s.len() - 1];
                    } else if d_pos_start == 0 {
                        md = MARK_START.to_string()
                            + &s[d_pos_start..d_pos_end + 1]
                            + MARK_END
                            + &s[d_pos_end + 1..s.len()];
                        skimmed = s[d_pos_end + 1..s.len()].to_string();
                    } else {
                        md = (&s[0..d_pos_start]).to_string()
                            + MARK_START
                            + &s[d_pos_start..d_pos_end + 1]
                            + MARK_END
                            + &s[d_pos_end + 1..s.len()];
                        skimmed = (&s[0..d_pos_start - 1]).to_string() + &s[d_pos_end + 1..s.len()];
                    }
                    skimmed = skimmed.trim().to_owned();
                }

                if s.trim().is_empty() {
                    _type = EMPTY_TYPE.to_string();
                } else {
                    _type = TYPE.to_string();
                }

                if date != "" {
                    _odr = 3 * order;
                    order += 1;

                    if !_has_dates {
                        _has_dates = true;
                    }
                }

                if is_first_itr {
                    prev._text = String::from(&s);
                    prev._md_text = String::from(&md);
                    prev._skimmed_text = String::from(&skimmed);
                    prev._type = HEAD_TYPE.to_string();
                    prev._level = level;
                    prev._indent = level * 1.8;
                    prev._order = _odr;
                    prev._pad = pad;
                    prev._date1 = date1.clone();
                    prev._date2 = date2.clone();
                    prev._is_updated = false;
                    prev._id = Node::count();
                    prev._first_child = None;
                    prev._next_sibling = None;
                    prev._color = color.clone();
                    prev._has_dates = is_date;
                    is_first_itr = false;
                } else if level == prev._level {
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(&md),
                        _skimmed_text: String::from(&skimmed),
                        _type: _type.clone(),
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _pad: pad,
                        _date1: date1.clone(),
                        _date2: date2.clone(),
                        _is_updated: false,
                        _id: Node::count(),
                        _first_child: None,
                        _next_sibling: None,
                        _prev_sibling: Some(Box::new(prev.clone())),
                        _color: color,
                        _has_dates: is_date,
                    };
                    prev._next_sibling = Some(Box::new(current));
                    prev = prev._next_sibling.as_mut().unwrap();
                } else if level > prev._level {
                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(&md),
                        _skimmed_text: String::from(&skimmed),
                        _type: _type.clone(),
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _pad: pad,
                        _date1: date1.clone(),
                        _date2: date2.clone(),
                        _is_updated: false,
                        _id: Node::count(),
                        _first_child: None,
                        _next_sibling: None,
                        _prev_sibling: Some(Box::new(prev.clone())),
                        _color: color,
                        _has_dates: is_date,
                    };
                    prev._first_child = Some(Box::new(current));
                    prev = prev._first_child.as_mut().unwrap();
                } else if level < prev._level {
                    while prev._level < level {
                        if prev._prev_sibling.is_none() {
                            break;
                        }
                        prev = prev._prev_sibling.as_mut().unwrap();
                    }

                    let current = Node {
                        _text: String::from(&s),
                        _md_text: String::from(&md),
                        _skimmed_text: String::from(&skimmed),
                        _type: _type.clone(),
                        _level: level,
                        _indent: level * 1.8,
                        _order: _odr,
                        _pad: pad,
                        _date1: date1.clone(),
                        _date2: date2.clone(),
                        _is_updated: false,
                        _id: Node::count(),
                        _first_child: None,
                        _next_sibling: None,
                        _prev_sibling: Some(Box::new(prev.clone())),
                        _color: color,
                        _has_dates: is_date,
                    };
                    prev._next_sibling = Some(Box::new(current));
                    prev = prev._next_sibling.as_mut().unwrap();
                }
                s.clear();
                skimmed.clear();
                md.clear();
                level = 0.0;
                is_indended = false;
                date.clear();
                is_date = false;
                is_prev_char = false;
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
    println!("done");
    // root.list();
    Ok(root)
}

fn parse_date(_date: &str, _min: u32, _max: u32) -> (String, String, i64, u32, u32) {
    let mut _d1: String = String::new();
    let mut _d2: String = String::new();

    if !_date.is_empty() {
        let date = _date.split(" - ").collect::<Vec<&str>>();
        if date.get(0).is_some() {
            _d1 = date.get(0).unwrap().to_string();
            _d1.remove(0);
            _d1.remove(0);
        }
        if date.get(1).is_some() {
            _d2 = date.get(1).unwrap().to_string();
            _d2.pop();
        } else {
            _d1.pop();
        }
    }

    if !_d1.is_empty() {
        let test = _d1.parse::<u32>();

        match test {
            Ok(_) => {
                return timline(&_d1, &_d2, _min, _max);
            }
            Err(_) => {
                return gantt(&_d1, &_d2, _min, _max);
            }
        }
    }

    return (_d1, _d2, 8, _min, _max);
}

fn timline(
    y1: &str,
    y2: &str,
    mut min_date: u32,
    mut max_date: u32,
) -> (String, String, i64, u32, u32) {
    if min_date == 0 || min_date > y1.parse::<u32>().unwrap() {
        min_date = y1.parse::<u32>().unwrap();
    }

    if !y2.is_empty() {
        if max_date == 0 || max_date < y2.parse::<u32>().unwrap() {
            max_date = y2.parse::<u32>().unwrap();
        }
        return (
            y1.to_owned(),
            y2.to_owned(),
            (y2.parse::<i64>().unwrap() - y1.parse::<i64>().unwrap()) * 3 + 1,
            min_date,
            max_date,
        );
    }
    (y1.to_owned(), String::new(), 1, min_date, max_date)
}

fn gantt(d1: &str, d2: &str, min_date: u32, max_date: u32) -> (String, String, i64, u32, u32) {
    let date1 = NaiveDate::parse_from_str(d1, "%Y-%m-%d").unwrap();
    if d2 != "" {
        let date2 = NaiveDate::parse_from_str(d2, "%Y-%m-%d").unwrap();
        return (
            date1.to_string(),
            date2.to_string(),
            (((date2 - date1).num_days() + 1) * 8),
            min_date,
            max_date,
        );
    }
    (date1.to_string(), String::new(), 8, min_date, max_date)
}
