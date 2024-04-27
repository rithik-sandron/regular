import { useState, useRef, useEffect } from "react";
import Year from "./gantt/Year";
import GanttEvent from "./gantt/GanttEvent";
import Tree from "./Tree";
import { invoke } from "@tauri-apps/api";
import TopComponent from "./TopComponent";
import Handlers from "./gantt/Handlers";
import Timeline from "./timeline/Timeline";
import Tyear from "./timeline/TYear";

export default function View() {
  const [node, setNode] = useState("");
  const [component, setComponent] = useState("Timeline");

  useEffect(() => {
    invoke("get_doc", { name: "regular" }).then((data) => {
      setNode(data);
    });
  }, []);

  async function p() {
    fetch("/u", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(node),
    });
  }

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
    node && (
      <>
        <section className="list-container">
          <TopComponent setComponent={setComponent} />

          <div
            id="m-list"
            className="blocks"
            contentEditable
            spellCheck="true"
            suppressContentEditableWarning="true"
          >
            <Tree data={node._first_child} root={node} p={p} />
          </div>
        </section>

        <section className="timeline-container">
          {component === "Gantt" && node._has_dates && (
            <div className="timeline-container-view">
              <Handlers
                view={view}
                handleClick={handleClick}
                handleClickView={handleClickView}
              />
              <div
                className="grid-container"
                style={{
                  height: node._order * 5 + "em",
                }}
              >
                {view === "Year" && <Year ref={ref} height={node._order} />}
                {/* {view === "Month" && <Month ref={ref} />} */}
                {/* {view === 'Day' && <Day ref={ref} />} */}
                <div
                  style={{
                    marginTop: "4em",
                  }}
                >
                  <GanttEvent data={node} />
                </div>
              </div>
            </div>
          )}

          {component === "Timeline" &&
            node._min_date !== 0 &&
            node._max_date !== 0 && (
              <div className="line-container">
                <Tyear min={node._min_date} max={node._max_date} />
                <Timeline
                  data={node}
                  min={node._min_date}
                  max={node._max_date}
                />
              </div>
            )}
        </section>
      </>
    )
  );
}
