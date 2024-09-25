import { useRef, useEffect, useCallback, forwardRef } from "react";
import Year from "./gantt/Year";
import GanttEvent from "./gantt/GanttEvent";
import Tree from "./Tree";
import Timeline from "./timeline/Timeline";
import Tyear from "./timeline/TYear";
import { invoke } from "@tauri-apps/api";
import { startMutationObserver, navigate, getMutationObserver, pauseMutationObserver } from '../lib/editorUtility'

export default forwardRef(function View(props, ref) {
  const
    { component,
      present,
      markdown,
      setMarkdown,
      fileId,
      isVerticalTimeline }
      = props;

  const INACTIVITY_TIMEOUT = 2000; // 2 seconds of inactivity before saving
  const activeId = useRef('');
  const editor = useRef(null);

  const mutate = useRef(new Map());
  const mutationObserver = useRef(null);
  const inactivityTimerRef = useRef(null);

  const saveContent = useCallback(() => {
    if (mutate.current.size !== 0) {
      console.log(mutate.current)
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
    return () => {
      pauseMutationObserver(mutationObserver);
      mutate.current = new Map();
      mutationObserver.current.disconnect();
      mutationObserver.current = null;
    };
  }, [markdown, fileId]);

  return (
    markdown && (
      <>
        {!present &&
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
        }

        {component && (
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
              : markdown._has_dates &&
              (
                <>
                  <div
                    className="grid-container"
                    style={{ height: `${markdown._order * 5}em` }}>
                    <Year ref={ref} height={markdown._order} />
                    <GanttEvent data={markdown} />
                  </div>
                </>
              )}
          </section>
        )}
      </>
    )
  );

});
