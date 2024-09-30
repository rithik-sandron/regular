export default function GanttEvent({ data, order = 0 }) {
  const pad =
    data._date1 &&
    (
      Math.max(
        0,
        (new Date(data._date1) - new Date("2024-01-01")) / (1000 * 3600 * 24)
      ) * 8
    ).toFixed(2) + "px";

  return (
    <>
      <div className="grid-tasks-container"
        style={{
          top: `${order}em`,
        }}>
        {data._date1 && (
          <div className="grid-tasks">
            <div
              style={{
                width: `${data._pad}px`,
                left: pad,
              }}
            >
              <p
                className="grid-tasks-text"
                style={{
                  width: `${data._skimmed_text.length}em`,
                }}
              >
                {data._skimmed_text}
              </p>
            </div>
          </div>
        )}
        <div className="grid-tasks-container">
          {data._first_child && <GanttEvent data={data._first_child} />}
        </div>
      </div>


      {data._next_sibling && <GanttEvent data={data._next_sibling} order={data._next_sibling._date1 ? order + 3 : order+1} />}
    </>
  );
}
