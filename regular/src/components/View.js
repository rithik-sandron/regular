import { useRef, useEffect, useCallback, forwardRef, memo } from "react";
import Year from "./gantt/Year";
import GanttEvent from "./gantt/GanttEvent";
import Tree from "./Tree";
import Timeline from "./timeline/Timeline";
import Tyear from "./timeline/TYear";
import { invoke } from "@tauri-apps/api";
import { navigate, getMutationObserver, pauseMutationObserver } from '../lib/editorUtility'

export default forwardRef(function View(props, year) {
  const
    { component,
      present,
      markdown,
      setMarkdown,
      fileId,
      editorContent,
      isVerticalTimeline }
      = props;

  const INACTIVITY_TIMEOUT = 3000; // 2 seconds of inactivity before saving
  const activeId = useRef('');
  const editor = useRef(null);

  const mutate = useRef(new Map());
  const mutationObserver = useRef(null);
  const inactivityTimerRef = useRef(null);

  const saveContent = useCallback(() => {
    if (mutate.current.size !== 0) {
      console.log(mutate.current)
      const index = editor.current.innerText.indexOf('\n')
      // return
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
    return () => {
      mutate.current = new Map();
      mutationObserver.current.disconnect();
      mutationObserver.current = null;
    };
  }, [markdown, fileId]);

  return (
    <>
      {(!present && editorContent) && (
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
            onKeyDown={(e) => navigate(e, mutationObserver, activeId, editor, editorContent)}
            onKeyUp={(e) => navigate(e, mutationObserver, activeId, editor)}
          >
            <Tree data={editorContent._first_child} />
          </div>

        </section>
      )
      }

      {(component && markdown) && (
        <section className="timeline-container">
          {isVerticalTimeline ? (
            <div className="line-container">
              <Tyear min={markdown._min_date} max={markdown._max_date} />
              <Timeline
                data={markdown}
                min={markdown._min_date}
                max={markdown._max_date}
              />
            </div>
          )
            : markdown._has_dates ?
              (
                <div className="grid-container">
                  <Year ref={year} />
                  <div style={{ position: "absolute", marginTop: "3em" }}>
                    <GanttEvent data={markdown} />
                  </div>
                </div>
              ) :

              (<div className="app-container-wrap">No events to display</div>)}
        </section>
      )}
    </>
  );
});
