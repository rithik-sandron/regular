import { useEffect, useState } from "react";

function getTime() {
  let dates = new Date();
  let months = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    months[dates.getMonth()] +
    " " +
    dates.getDate() +
    ", " +
    dates.getFullYear() +
    " " +
    dates.getHours() +
    " : " +
    dates.getMinutes() +
    " : " +
    dates.getSeconds()
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
    <time
      suppressHydrationWarning
      style={{
        marginTop: "1px",
        fontSize: "14.6px",
        alignSelf: "center",
      }}
    >
      {time}
    </time>
  );
}
