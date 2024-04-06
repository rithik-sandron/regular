export default function TimelineEvent({ data, gap }) {
  const MEASURE = "em";
  console.log(data.text, data.childrenCount)
  const pad =
    (
      (new Date(data.date1) - new Date("2024-1-1")) /
      (1000 * 3600 * 24) /
      1.992
    ).toFixed(2) + MEASURE;
  const width = data.pad + MEASURE;
  const re = (
    <div className="grid-tasks-container">
      <div className="grid-tasks">
        <div
          style={{
            width: width,
            left: pad,
          }}
        >
          <p
            className="grid-tasks-text"
            style={{
              width: data.skimmedText.length + MEASURE,
            }}
          >
            {data.skimmedText}
          </p>
        </div>
      </div>
      {data.firstChild && <TimelineEvent data={data.firstChild} />}
      <div
        className="next-sibling"
        style={{
          paddingTop: data.childrenCount*4 + 'em',
        }}
      >
        {data.nextSibling && <TimelineEvent data={data.nextSibling} />}
      </div>
    </div>
  );
  return re;
}
