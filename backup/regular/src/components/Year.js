import { forwardRef } from "react";

export default forwardRef(function Year(props, ref) {
  let current = new Date();
  let currentMonth = current.getMonth();
  let currentYear = current.getFullYear();
  let currentDate = current.getDate();

  // const DAYS = [1, 5, 10, 15, 20, 25]
  const DAYS = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];

  const MONTHS = [
    { m: "January", n: 31 },
    { m: "February", n: 28 },
    { m: "March", n: 31 },
    { m: "April", n: 30 },
    { m: "May", n: 31 },
    { m: "June", n: 30 },
    { m: "July", n: 31 },
    { m: "August", n: 31 },
    { m: "September", n: 30 },
    { m: "October", n: 31 },
    { m: "November", n: 30 },
    { m: "December", n: 31 },
  ];

  function grid() {
    let arr = [];
    let start = new Date("2024-01-01");
    let end = new Date(`${new Date().getFullYear()}-12-31`);
    // year
    let startYear = start.getFullYear();
    while (startYear <= end.getFullYear()) {
      let i = start.getMonth();
      for (; i <= end.getMonth(); i++) {
        arr.push({ year: startYear, month: i });
      }
      startYear++;
    }
    return arr;
  }

  return (
    <div
      className="timeline-grid-year"
      style={{
        height: props.height * 6 + "em",
      }}
    >
      <span className="sticky">{currentYear}</span>
      {grid().map((x) => {
        return (
          <div
            key={x.year + "" + x.month}
            ref={
              currentMonth === x.month && currentYear === x.year ? ref : null
            }
            style={{
              width: 8 * MONTHS[x.month].n + "px",
            }}
          >
            <span>{MONTHS[x.month].m}</span>
            <div className="timeline-grid-year-dates">
              {DAYS.map((y) => {
                if (y === 1 || (y < 26 && y % 5 === 0)) {
                  return (
                    <div
                      key={x.year + "" + x.month + "" + y}
                      style={{
                        width: 5 * 8 + "px",
                      }}
                      className="timeline-grid-year-date"
                    >
                      {y}
                    </div>
                  );
                } else if (
                  currentMonth === x.month &&
                  currentYear === x.year &&
                  currentDate === y
                ) {
                  return (
                    <div
                      key={x.year + "" + x.month + "" + y}
                      style={{
                        position: "absolute",
                        left: y * 8 + "px",
                      }}
                    >
                      <span
                        className="current"
                        style={{
                          height: props.height * 6 + "em",
                        }}
                      />
                      <span className="currrent-text">{y}</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});
