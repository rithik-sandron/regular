export default function GanttEvent({ data }) {
  const pad =
    data._date1 &&
    (
      Math.max(
        0,
        (new Date(data._date1) - new Date("2024-01-01")) / (1000 * 3600 * 24)
      ) * 8.03
    ).toFixed(2) + "px";
  return (
<div className="grid-tasks-container">
      {data._date1 && (
        <div className="grid-tasks">
          <div
            style={{
              width: data._pad + "px",
              left: pad,
              top: data._order + "em",
            }}
          >
            <p
              className="grid-tasks-text"
              style={{
                width: data._skimmedText.length + "em",
              }}
            >
              {data._skimmedText}
            </p>
          </div>
        </div>
      )}
      {data._firstChild && <GanttEvent data={data._firstChild} />}
      {data._nextSibling && <GanttEvent data={data._nextSibling} />}
    </div>
  );
}
