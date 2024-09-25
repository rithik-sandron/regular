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
