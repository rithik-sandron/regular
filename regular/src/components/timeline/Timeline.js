const Timeline = ({ data, min, max }) => {
  function top() {
    return (data._date1 - min) * 2 + "px";
  }

  // const getColor = () => {
  //   const h = Math.floor(Math.random() * 300);
  //   return `hsl(${h}deg, 53%, 70%, 1.0)`;
  // };

  function getColor(str = "") {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 255;
      color += ('255' + value.toString(16)).slice(-2);
    }
    return color + "95";
  }

  const color = getColor(data._skimmed_text + data._id);

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
