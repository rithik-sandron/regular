const TopComponent = ({ setComponent, component }) => {
  function handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    setComponent(() => !component);
  }
  return (
    <div className="top">
      <div onClick={(e) => handleClick(e)}>{component ? "Gantt" : "Timeline"}</div>
    </div>
  );
};

export default TopComponent;
