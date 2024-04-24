const TopComponent = ({ setComponent }) => {
  function handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    setComponent(e.target.innerText);
  }
  return (
    <div className="top">
      <div onClick={(e) => handleClick(e)}>Gantt</div>
      <div onClick={(e) => handleClick(e)}>Timeline</div>
    </div>
  );
};

export default TopComponent;
