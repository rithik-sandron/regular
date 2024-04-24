const Timeline = ({ data, min, max }) => {
  function top() {
    return (data._date1 - min) * 3 + "px";
  }

  const getColor = () => {
    const h = Math.floor(Math.random() * 800);
    return `hsl(${h}deg, 53%, 58%)`;
    // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // return "#" + randomColor;
  };

  const color = getColor();

  return (
    <>
      {data._date1 && (
        <>
          <div
            id={`event-timeline-${data._id}`}
            className="line-event"
            style={{
              height: data._pad + "px",
              top: top(),
              // backgroundColor: data._color,
              backgroundColor: color,
            }}
          />
          <div
            className="line-event-text"
            style={{
              top: `calc(${top()} - 2px)`,
              backgroundColor: color,
            }}
          >
            {data._skimmedText}
          </div>
        </>
      )}
      {data._firstChild && (
        <Timeline data={data._firstChild} min={min} max={max} />
      )}
      {data._nextSibling && (
        <Timeline data={data._nextSibling} min={min} max={max} />
      )}
    </>
  );
};

export default Timeline;
