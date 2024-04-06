import { useState, useRef, useEffect } from "react";
import TimelineEvent from "@/components/TimelineEvent";
import Year from "./Year";

export default function Timeline({ data }) {
  const [view, setView] = useState(24);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, []);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
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
        <div
          style={{
            marginTop: "4em",
          }}
        >
          <TimelineEvent data={data} />
        </div>
      </div>
    </div>
  );
}
