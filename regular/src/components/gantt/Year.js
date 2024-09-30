import { forwardRef, useState } from "react";
import DateTime from "../DateTime";

export default forwardRef(function Year(props, ref) {
  console.log(ref)

  const [scrollYearLeft, setScrollYearLeft] = useState(new Date().getFullYear());
  const [scrollYearRight, setScrollYearRight] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);

  let current = new Date();
  let currentMonth = current.getMonth();
  let currentYear = current.getFullYear();
  let currentDate = current.getDate();

  // const DAYS = [1, 5, 10, 15, 20, 25]
  const DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  const DAY = [1, 6, 11, 16, 21, 26];
  const MONTHS = [
    { m: "January", n: 31 },
    { m: "February", n: 29 },
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

  // useEffect(() => {
  //   const timelineContainer = timelineContainerRef.current;

  //   const handleScroll = () => {
  //     const { scrollLeft, scrollWidth, clientWidth } = timelineContainer;
  //     const isAtTheEnd = scrollLeft + clientWidth >= scrollWidth;
  //     const isAtTheStart = scrollLeft === 0;

  //     if (isAtTheStart && currentYear > 1900) {
  //       setIsLoading(true);
  //       // Load previous year data
  //       setCurrentYear(currentYear - 1);
  //       setIsLoading(false);
  //     } else if (isAtTheEnd) {
  //       setIsLoading(true);
  //       // Load next year data
  //       setCurrentYear(currentYear + 1);
  //       setIsLoading(false);
  //     }
  //   };

  //   timelineContainer.addEventListener('scroll', handleScroll);

  //   return () => {
  //     timelineContainer.removeEventListener('scroll', handleScroll);
  //   };
  // }, [currentYear]);

  return (
    <div
      className="timeline-grid-year"
      style={{ height: "100%" }}>
      <span className="sticky">{currentYear}</span>
      {grid().map((x) => {
        return (
          <div
            key={`${x.year}-${x.month}`}
            style={{ width: `${8 * MONTHS[x.month].n}px` }}>

            <span className="month">{MONTHS[x.month].m}</span>

            <div className="timeline-grid-year-dates">
              {DAYS.map((y) => {
                return (
                  <div key={y}>
                    {current_date_view(x, y)}
                    {year_view(x, y)}
                  </div>
                );
              })}
            </div>

          </div>
        );
      })}
    </div>
  );

  function grid() {
    let arr = [];
    let start = new Date(`${currentYear}-01-01`);
    let end = new Date(`${currentYear}-12-31`);
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

  function year_view(x, y) {
    if (DAY.includes(y)) {
      return (
        <div key={`${x.year}${x.month}${y}`}>
          <div
            style={{ width: `${y === 26 ? (MONTHS[x.month].n - y + 1) * 8 : 5 * 8}px` }}
            className="timeline-grid-year-date">
            {y}
          </div>
        </div>
      );
    }
  }

  function current_date_view(x, y) {

    if (
      currentMonth === x.month &&
      currentYear === x.year &&
      currentDate === y
    ) {
      return (
        <>
          <div
            style={{
              position: "absolute",
              left: `${(y * 8) - 8}px`,
            }}
          >
            <span
              className="current"
              style={{
                height: "100vh",
              }}
            />
            <span
              ref={
                currentMonth === x.month && currentYear === x.year ? ref : null
              }
              id="date-current">{y}
            </span>
            <DateTime />
          </div>
        </>

      );
    }
  }
});
