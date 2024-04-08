import { useState, useRef } from "react";
import Year from "./Year";
import Month from "./Month";
import TimelineEvent from "./TimelineEvent";
import Tree from "./Tree";
import {
  handleChange,
  handleKeydown,
  handleKeyup,
  setCursor,
  getCursor,
} from "@/lib/userHandles";

export default function Timeline({ data }) {
  const [view, setView] = useState("Year");
  const ref = useRef(null);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    ref.current?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
  }

  function handleClickView(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.localName === "p") {
      setView(e.target.innerText);
    }
  }

  return (
    <>
      <section className="list-container">
        <div
          id="m-list"
          className="blocks"
          contentEditable
          spellCheck="true"
          suppressContentEditableWarning="true"
        >
          <Tree data={data} />
        </div>
      </section>
      <section className="timeline-container">
        <div className="timeline-container-view">
          <div className="handlers">
            <div onClick={handleClick}>Today</div>
            <div className="dropdown" onClick={handleClickView}>
              <span>{view}</span>
              <div className="dropdown-content">
                <p>Year</p>
                <p>Month</p>
                <p>Day</p>
              </div>
            </div>
          </div>
          <div
            className="grid-container"
            style={{
              height: data.order * 5 + "em",
            }}
          >
            {view === "Year" && <Year ref={ref} height={data.order} />}
            {view === "Month" && <Month ref={ref} />}
            {/* {view === 'Day' && <Day ref={ref} />} */}
            <div
              style={{
                marginTop: "4em",
              }}
            >
              <TimelineEvent data={data} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
