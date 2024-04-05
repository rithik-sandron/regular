import { useState, useRef, useEffect } from "react";

export default function Day({ ref }) {
  let current = new Date();
  let currentMonth = current.getMonth();
  let currentYear = current.getFullYear();
  let currentDate = current.getDate();
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
    let start = new Date("2024-1-1");
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

  {
    /* <div className="timeline-grid-day">
          {grid().map((x) => {
            return <div key={x}>{x}</div>;
          })}
        </div> */
  }
  return (
    <div className="timeline-grid-year">
      <span className="sticky">{currentYear}</span>
      {grid().map((x) => {
        return (
          <div
            className="timeline-grid-year-container"
            key={x.year + "" + x.month}
          >
            <div
              ref={
                currentMonth === x.month && currentYear === x.year ? ref : null
              }
              style={{
                width: 8 * MONTHS[x.month].n + "px",
              }}
            >
              <span>{MONTHS[x.month].m}</span>
              <div className="timeline-grid-year-dates">
                {[1, 5, 10, 15, 20, 25].map((y) => {
                  return (
                    <div
                      key={y}
                      style={{
                        width: MONTHS[x.month].n * 4 + "px",
                      }}
                      className="timeline-grid-year-date"
                    >
                      {y}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
