const Tyear = ({ min, max }) => {
  function grid() {
    let arr = [];
    let start = min;
    // let end = new Date().getFullYear();
    let end = max;
    while (start <= end) {
      arr.push(start);
      start += 10;
    }
    return arr;
  }

  return (
    <div
      style={{
        width: "fit-content",
      }}
    >
      {grid().map((x) => {
        return (
          <div
            key={x}
            style={{
              height: 10 * 2 + "px",
            }}
          >
            {x}
          </div>
        );
      })}
    </div>
  );
};

export default Tyear;
