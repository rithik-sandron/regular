import { useEffect, useState } from "react";
import { getTime } from "../lib/generalUtility";

export default function DateTime() {
  const [time, setTime] = useState(() => getTime());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTime());
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time id="time-current" suppressHydrationWarning>{time}</time>
  );
}
