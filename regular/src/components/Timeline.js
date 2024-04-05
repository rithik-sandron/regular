import { useState, useRef, useEffect } from "react";
import data from "@/lib/sample.json";
import TimelineEvent from "@/components/TimelineEvent";
import Year from "./Year";

export default function Timeline() {
  const [view, setView] = useState(24);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, []);

  function handleClick(e) {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  }

  return (
    <div>
      <span className="handlers" onClick={handleClick}>
        Today
      </span>
      <div className="grid-container">
        <Year ref={ref} />
        <div className="grid-tasks-container">
          <TimelineEvent data={data.firstChild} />
        </div>
      </div>
    </div>
  );
}
