const only_date = /\d{2,4}(\/|\-)\d{1,2}(\/|\-)\d{1,2}/;
const date = /\!\(\d{2,4}(\/|\-)\d{1,2}(\/|\-)\d{1,2}\)/;
const dateRange =
  /\!\(\d{2,4}(\/|\-)\d{1,2}(\/|\-)\d{1,2}\s\-\s\d{2,4}(\/|\-)\d{1,2}(\/|\-)\d{1,2}\)/;

function getTime(d) {
  let date = new Date(d);
  let months = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let s =
    months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

  s += date.getHours() !== 0 ? " " + date.getHours() : "";
  s += date.getMinutes() !== 0 ? " : " + date.getMinutes() : "";
  s += date.getSeconds() !== 0 ? " : " + date.getSeconds() : "";
  return s;
}

function diffDate(date1, date2) {
  if (date2 > date1) return date2 - date1;
  else "Invalid Date";
}

export function render(text = "") {
  let isFound = false;
  let skimmedText = "";

  text = text.replace(dateRange, (m, n, o, p, u, index) => {
    let dates = [];
    text = text.replace(only_date, (match) => {
      isFound = true;
      dates[0] = match;
      return "";
    });
    text = text.replace(only_date, (match) => {
      dates[1] = match;
      return "";
    });
    skimmedText = text.substring(0, index);
    return `<mark className='due-date'>🗓 ${
      getTime(dates[0]) + " - " + getTime(dates[1])
    }</mark>`;
  });

  text = text.replace(date, (m, n, o, index) => {
    skimmedText = text.substring(0, index);
    return `<mark className='due-date'>🗓 ${getTime(
      m.substring(2, m.length - 1)
    )}</mark>`;
  });
  return [text, skimmedText];
}
