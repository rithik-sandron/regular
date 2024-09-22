import { useState, useRef, useEffect, useCallback } from "react";
import Year from "./gantt/Year";
import GanttEvent from "./gantt/GanttEvent";
import Tree from "./Tree";
import Handlers from "./gantt/Handlers";
import Timeline from "./timeline/Timeline";
import Tyear from "./timeline/TYear";
import { invoke } from "@tauri-apps/api";

import { startMutationObserver, navigate, getMutationObserver, pauseMutationObserver } from '../lib/editorUtility'
import TopComponent from "./TopComponent";

export default function View({ component, setComponent, markdown, setMarkdown, fileId }) {
  const INACTIVITY_TIMEOUT = 2000; // 2 seconds of inactivity before saving
  const activeId = useRef('');
  const editor = useRef(null);
  const [view, setView] = useState("Year");
  const ref = useRef(null);

  const mutate = useRef(new Map());
  const mutationObserver = useRef(null);

  const inactivityTimerRef = useRef(null);

  const saveContent = useCallback(() => {
    if (mutate.current.size !== 0) {
      console.log(mutate)
      const index = editor.current.innerText.indexOf('\n')
      return
      invoke("save", {
        mutate: mutate.current,
        id: fileId.toString(),
        name: editor.current.innerText.slice(0, index),
        raw: editor.current.innerText,
        markdown: JSON.stringify(markdown)
      }).then(data => {
        setMarkdown(data !== "" ? JSON.parse(data) : data);
      });
      mutate.current.clear();
    }
  }, [mutate, markdown]);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      saveContent();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [saveContent]);



  useEffect(() => {
    // Changes observer
    mutationObserver.current = getMutationObserver(mutate.current, activeId, resetInactivityTimer);
    // startMutationObserver(mutationObserver, editor);
    ref.current?.scrollIntoView({
      inline: "center",
      block: "nearest"
    });
    return () => {
      pauseMutationObserver(mutationObserver);
      mutate.current = new Map();
      mutationObserver.current.disconnect();
      mutationObserver.current = null;
    };
  }, [markdown, fileId]);


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
        <TopComponent component={component} setComponent={setComponent} />
        <section className="list-container">
          <div
            id="editor"
            ref={editor}
            className="blocks"
            contentEditable
            spellCheck="true"
            suppressContentEditableWarning="true"
            onClick={(e) => navigate(e, mutationObserver, activeId, editor)}
            onInput={(e) => navigate(e, mutationObserver, activeId, editor)}
            onKeyDown={(e) => navigate(e, mutationObserver, activeId, editor, markdown)}
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
