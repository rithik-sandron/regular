import { useEffect, useState } from "react";

function getTime() {
  let dates = new Date();
  let months = [
    "Mon",
    "Tues",
    "Wed",
    "Thur",
    "Fri",
    "Sat",
    "Sun",
  ];

  return (
    months[dates.getMonth()] +
    " " +
    dates.getHours() +
    ":" +
    dates.getMinutes()
  );
}

export default function DateTime() {
  const [time, setTime] = useState(() => getTime());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTime());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  
  return (
    <time id="time-current" suppressHydrationWarning>{time}</time>
  );
}
