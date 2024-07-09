const Timeline = ({ data, min, max }) => {
  console.log(data)
  function top() {
    return (data._date1 - min) * 3 + "px";
  }

  const getColor = () => {
    const h = Math.floor(Math.random() * 800);
    return `hsl(${h}deg, 53%, 58%)`;
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
