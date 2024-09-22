const Timeline = ({ data, min, max }) => {
  function top() {
    return (data._date1 - min) * 2 + "px";
  }

  const getColor = () => {
    const h = Math.floor(Math.random() * 300);
    return `hsl(${h}deg, 43%, 70%)`;
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
              height: `${data._pad}px`,
              top: top(),
              backgroundColor: color,
            }}
          />
          <div
            className="line-event-text"
            style={{
              top: top(),
              backgroundColor: color,
            }}
          >
            {data._skimmed_text}
          </div>
        </>
      )}
      {data._first_child && (
        <Timeline data={data._first_child} min={min} max={max} />
      )}
      {data._next_sibling && (
        <Timeline data={data._next_sibling} min={min} max={max} />
      )}
    </>
  );
};

export default Timeline;
