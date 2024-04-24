use chrono::NaiveDate;
use regex::Regex;

const MONTH: [&str; 12] = [
    "Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec",
];

pub fn render(
    hay: &str,
    min_date: u32,
    max_date: u32,
) -> (String, String, String, String, f64, String, u32, u32) {
    let date: Regex =
        Regex::new(r"\s*(.*)\s*(!\()([0-9]{4})(-)([0-9]{1, 2})(-)([0-9]{1, 2})(\))\s*(.*)\s*")
            .unwrap();
    let date_range: Regex = Regex::new(r"\s*(.*)\s*(!\()([0-9]{4})(-)([0-9]{1, 2})(-)([0-9]{1, 2})(\s*-\s*)([0-9]{4})(-)([0-9]{1, 2})(-)([0-9]{1, 2})(\))\s*(.*)\s*").unwrap();

    // for A.D. => 1, 100, 1000, 2024
    let year: Regex = Regex::new(r"\s*(.*)\s*(!\()([0-9]{1, 4})(\))\s*(.*)\s*").unwrap();
    let year_range: Regex =
        Regex::new(r"\s*(.*)\s*(!\()([0-9]{1, 4})(\s*-\s*)([0-9]{1, 4})(\))\s*(.*)\s*").unwrap();

    let mut skimmed_text = String::new();
    let mut md_text = String::new();

    if date.is_match(hay) {
        let result = date.captures(hay).unwrap();
        let d1 = result.get(3).unwrap().as_str().to_string()
            + result.get(4).unwrap().as_str()
            + result.get(5).unwrap().as_str()
            + result.get(6).unwrap().as_str()
            + result.get(7).unwrap().as_str();
        md_text = result.get(1).unwrap().as_str().to_string()
            + "<mark className='due-date'>"
            + MONTH[result.get(5).unwrap().as_str().parse::<usize>().unwrap()]
            + " "
            + result.get(7).unwrap().as_str()
            + ", "
            + result.get(3).unwrap().as_str()
            + "</mark>"
            + result.get(9).unwrap().as_str();
        skimmed_text =
            result.get(1).unwrap().as_str().to_string() + result.get(9).unwrap().as_str();
        let (date1, _, _diff) = parse_date(&d1, "");
        (
            md_text,
            skimmed_text.trim().to_string(),
            date1,
            Default::default(),
            _diff,
            String::new(),
            min_date,
            max_date,
        )
    } else if date_range.is_match(hay) {
        let result = date_range.captures(hay).unwrap();
        let d1 = result.get(3).unwrap().as_str().to_string()
            + result.get(4).unwrap().as_str()
            + result.get(5).unwrap().as_str()
            + result.get(6).unwrap().as_str()
            + result.get(7).unwrap().as_str();
        let d2 = result.get(9).unwrap().as_str().to_string()
            + result.get(10).unwrap().as_str()
            + result.get(11).unwrap().as_str()
            + result.get(12).unwrap().as_str()
            + result.get(13).unwrap().as_str();

        md_text = result.get(1).unwrap().as_str().to_string()
            + "<mark className='due-date'>"
            + "From "
            + MONTH[result.get(5).unwrap().as_str().parse::<usize>().unwrap()]
            + " "
            + result.get(7).unwrap().as_str()
            + ", "
            + result.get(3).unwrap().as_str()
            + " to "
            + MONTH[result.get(11).unwrap().as_str().parse::<usize>().unwrap()]
            + " "
            + result.get(13).unwrap().as_str()
            + ", "
            + result.get(9).unwrap().as_str()
            + "</mark>"
            + result.get(15).unwrap().as_str();
        skimmed_text =
            result.get(1).unwrap().as_str().to_string() + result.get(7).unwrap().as_str();
        let (date1, date2, _diff) = parse_date(&d1, &d2);
        (
            md_text,
            skimmed_text.trim().to_string(),
            date1,
            date2,
            _diff,
            String::new(),
            min_date,
            max_date,
        )
    } else if year.is_match(hay) {
        let result = year.captures(hay).unwrap();
        let d1 = result.get(3).unwrap().as_str();

        md_text = result.get(1).unwrap().as_str().to_string()
            + "<mark className='due-date'>"
            + result.get(3).unwrap().as_str()
            + "</mark>"
            + result.get(5).unwrap().as_str();

        skimmed_text =
            result.get(1).unwrap().as_str().to_string() + result.get(5).unwrap().as_str();
        let (date1, _, _diff, min_date, max_date) = parse_year_as_num(&d1, "", min_date, max_date);
        (
            md_text,
            skimmed_text.trim().to_string(),
            date1,
            Default::default(),
            _diff,
            color(),
            min_date,
            max_date,
        )
    } else if year_range.is_match(hay) {
        let result = year_range.captures(hay).unwrap();
        let d1 = result.get(3).unwrap().as_str();
        let d2 = result.get(5).unwrap().as_str();

        md_text = result.get(1).unwrap().as_str().to_string()
            + "<mark className='due-date'>"
            + result.get(3).unwrap().as_str()
            + result.get(4).unwrap().as_str()
            + result.get(5).unwrap().as_str()
            + "</mark>"
            + result.get(7).unwrap().as_str();

        skimmed_text =
            result.get(1).unwrap().as_str().to_string() + result.get(7).unwrap().as_str();
        let (date1, date2, _diff, min_date, max_date) =
            parse_year_as_num(&d1, &d2, min_date, max_date);
        (
            md_text,
            skimmed_text.trim().to_string(),
            date1,
            date2,
            _diff,
            color(),
            min_date,
            max_date,
        )
    } else {
        (
            skimmed_text,
            md_text,
            Default::default(),
            Default::default(),
            0.0,
            String::new(),
            min_date,
            max_date,
        )
    }
}

fn parse_date(d1: &str, d2: &str) -> (String, String, f64) {
    let date1 = NaiveDate::parse_from_str(d1, "%Y-%m-%d").unwrap();
    if d2 != "" {
        let date2 = NaiveDate::parse_from_str(d2, "%Y-%m-%d").unwrap();
        return (
            date1.to_string(),
            date2.to_string(),
            ((date2 - date1).num_days() as f64 * 8.03) + 1.0,
        );
    }
    (date1.to_string(), String::new(), 8.03)
}

fn parse_year_as_num(
    y1: &str,
    y2: &str,
    mut min_date: u32,
    mut max_date: u32,
) -> (String, String, f64, u32, u32) {
    if min_date == 0 || min_date > y1.parse::<u32>().unwrap() {
        min_date = y1.parse::<u32>().unwrap();
    }

    if y2 != "" {
        if max_date == 0 || max_date < y2.parse::<u32>().unwrap() {
            max_date = y2.parse::<u32>().unwrap();
        }
        return (
            y1.to_owned(),
            y2.to_owned(),
            (y2.parse::<u32>().unwrap() - y1.parse::<u32>().unwrap()) as f64 * 3.0 + 1.0,
            min_date,
            max_date,
        );
    }
    (y1.to_owned(), String::new(), 8.03, min_date, max_date)
}

fn color() -> std::string::String {
    String::new()
}
