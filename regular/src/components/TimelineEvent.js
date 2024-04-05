export default function TimelineEvent({ data }) {
  // april 1 -> from 1-1-2024 to 3-3-2024 : 736px
  const padd = (720 + 2) / 16;
  const width = (8 * 15 + 1) / 16;
  const MEASURE = "em";

  const re = (
    <div className="grid-tasks">
      <div
        style={{
          width: width + MEASURE,
          left: padd + MEASURE,
        }}
      >
        <p className="grid-tasks-text">{data.skimmedText}</p>
      </div>
    </div>
  );
  return re;
}
