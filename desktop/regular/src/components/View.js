import { useState, useRef, useEffect } from "react";
import Year from "./gantt/Year";
import GanttEvent from "./gantt/GanttEvent";
import Tree from "./Tree";
import Handlers from "./gantt/Handlers";
import Timeline from "./timeline/Timeline";
import Tyear from "./timeline/TYear";
import { startMutationObserver, navigate, getMutationObserver } from '../lib/editorUtility'

export default function View({ component, markdown }) {
  const mutationObserver = useRef(null);
  const activeId = useRef('');
  const editor = useRef(null);
  const [view, setView] = useState("Year");
  const ref = useRef(null);
  const mutate = useRef(new Map());

  useEffect(() => {
    // Changes observer
    mutationObserver.current = getMutationObserver(mutate.current, activeId);
    startMutationObserver(mutationObserver, editor);
    ref.current?.scrollIntoView({
      inline: "center",
      block: "nearest"
    });
    return () => {
      mutationObserver.current.disconnect();
    };
  }, [markdown]);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    ref.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
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
    markdown && (
      <>
        <section className="list-container">
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
            <Tree data={markdown._first_child} />
          </div>

        </section>
        {component && (
          <section className="timeline-container">


            {markdown._min_date !== 0 &&
              markdown._max_date !== 0 ? markdown._min_date !== 0 &&
              markdown._max_date !== 0 && (
              <div className="line-container">
                <Tyear min={markdown._min_date} max={markdown._max_date} />
                <Timeline
                  data={markdown}
                  min={markdown._min_date}
                  max={markdown._max_date}
                />
              </div>
            )
              :
              (
                <>
                  <Handlers
                    view={view}
                    handleClick={handleClick}
                    handleClickView={handleClickView} />
                  <div
                    className="grid-container"
                    style={{ height: `${markdown._order * 5}em` }}>
                    {view === "Year" && <Year ref={ref} height={markdown._order} />}
                    <GanttEvent data={markdown} />
                  </div>
                </>
              )}
          </section>
        )}
      </>
    )
  );
}
