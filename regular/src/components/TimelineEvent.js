export default function TimelineEvent({ data }) {
  const pad =
    data.date1 &&
    (
      Math.max(
        0,
        (new Date(data.date1) - new Date("2024-01-01")) / (1000 * 3600 * 24)
      ) * 8.03
    ).toFixed(2) + "px";
  return (
    <div className="grid-tasks-container">
      {data.date1 && (
        <div className="grid-tasks">
          <div
            style={{
              width: data.pad + "px",
              left: pad,
              top: data.order + "em",
            }}
          >
            <p
              className="grid-tasks-text"
              style={{
                width: data.skimmedText.length + "em",
              }}
            >
              {data.skimmedText}
            </p>
          </div>
        </div>
      )}
      {data.firstChild && <TimelineEvent data={data.firstChild} />}
      {data.nextSibling && <TimelineEvent data={data.nextSibling} />}
    </div>
  );
}
