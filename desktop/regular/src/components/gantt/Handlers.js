const Handlers = ({ handleClick, handleClickView, view }) => {
  return (
    <div className="handlers">
      <div onClick={handleClick}>Today</div>
      <div className="dropdown" onClick={handleClickView}>
        <span>{view}</span>
        <div className="dropdown-content">
          <p>Year</p>
          <p>Month</p>
          <p>Day</p>
        </div>
      </div>
    </div>
  );
};

export default Handlers;
