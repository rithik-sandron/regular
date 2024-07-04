import { useState, useRef, useEffect } from "react";
import Year from "./gantt/Year";
import GanttEvent from "./gantt/GanttEvent";
import Tree from "./Tree";
import { invoke } from "@tauri-apps/api";
import TopComponent from "./TopComponent";
import Handlers from "./gantt/Handlers";
import Timeline from "./timeline/Timeline";
import Tyear from "./timeline/TYear";
import { startMutationObserver, navigate, getMutationObserver } from '../lib/editorUtility'
import DateTime from "./DateTime";

export default function View() {
  const [node, setNode] = useState("");
  const [component, setComponent] = useState("Gantt");
  const mutationObserver = useRef(null);
  const activeId = useRef('');
  const editor = useRef(null);
  const [view, setView] = useState("Year");
  const ref = useRef(null);
  const mutate = useRef(new Map());

  useEffect(() => {
    invoke("get_doc", { name: "regular" }).then(data => setNode(JSON.parse(data)));
  }, []);

  useEffect(() => {
    mutationObserver.current = getMutationObserver(mutate.current, activeId);
    startMutationObserver(mutationObserver, editor);
    return () => {
      mutationObserver.current.disconnect();
    };
  }, [node]);

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
            id="editor"
            ref={editor}
            className="blocks"
            contentEditable
            spellCheck="true"
            suppressContentEditableWarning="true"
            onClick={(e) => navigate(e, mutationObserver, activeId, editor)}
            onKeyDown={(e) => navigate(e, mutationObserver, activeId, editor)}
            onKeyUp={(e) => navigate(e, mutationObserver, activeId, editor)}
          >
            <Tree data={node._first_child} />
          </div>
        </section>
        {component === "Gantt" && node._has_dates &&
          (<section className="timeline-container">
            <div>
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
                <GanttEvent data={node} />
              </div>
            </div>

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
          )}
      </>
    )
  );
}
