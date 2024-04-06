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

function calculatePad(date1, date2) {
  if (date2 === null) {
    return 1;
  }

  date1 = new Date(date1);
  date2 = new Date(date2);

  if (date2 > date1)
    return ((date2 - date1) / (1000 * 3600 * 24) / 1.992).toFixed(2);
  else return 1;
}

export function render(text = "") {
  let skimmedText = "";
  let dates = [];
  let isFound = false;

  text = text.replace(dateRange, (m, n, o, p, u, index) => {
    isFound = true;
    text = text.replace(only_date, (match) => {
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
    isFound = true;
    //TODO:pdate to allow dates in middle
    dates[0] = text.substring(index + 2, text.length - 1);
    dates[1] = null;

    skimmedText = text.substring(0, index);
    return `<mark className='due-date'>🗓 ${getTime(
      m.substring(2, m.length - 1)
    )}</mark>`;
  });

  if (!isFound) {
    return [text, "", 1, null, null];
  }
  return [
    text,
    skimmedText,
    calculatePad(dates[0], dates[1]),
    dates[0],
    dates[1],
  ];
}
