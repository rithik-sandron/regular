import Handlers from "./gantt/Handlers";
import { forwardRef } from "react";

export default forwardRef(function TopComponent(props, ref) {

  const
    { setComponent,
      component,
      explorer,
      setExplorer,
      present,
      fileId,
      setPresent,
      isVerticalTimeline,
      hasDates
    } = props;

  function toggleComponent(e) {
    e.stopPropagation();
    e.preventDefault();
    setComponent(() => !component);
  }

  function toggleExplorer(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log("h")
    setExplorer(() => !explorer);
  }

  function togglePresentation(e) {
    e.stopPropagation();
    e.preventDefault();
    setComponent(() => true);
    setPresent(() => !present);
  }

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    ref.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }

  return (
    <div className="top-bar">
      {!present &&
        <>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
          <span className="material-symbols-outlined toggle-switch-right" onClick={(e) => toggleExplorer(e)}>
            notes
          </span>
        </>
      }

      {fileId &&
        <>

          {hasDates &&
            <>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
              <span className="material-symbols-outlined toggle-switch-present" onClick={(e) => togglePresentation(e)}>
                preview
              </span>
            </>
          }

          {(present || component) && hasDates && !isVerticalTimeline &&
            <Handlers handleClick={handleClick} />
          }

          {!present && (
            <>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
              <span className="material-symbols-outlined toggle-switch-left" onClick={(e) => toggleComponent(e)}>
                dock_to_left
              </span>
            </>
          )}
        </>
      }

    </div>
  );
});