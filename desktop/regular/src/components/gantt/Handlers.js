const Handlers = ({ handleClick, handleClickView, view }) => {
  return (
    <div className="handlers">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      <div className= "interact-button" onClick={handleClick}>
        <span className="material-symbols-outlined">
          today
        </span>
        <h3>Today</h3>
      </div>
      {/* <div className="dropdown" onClick={handleClickView}>
        <span>{view}</span>
        <div className="dropdown-content">
          <p>Year</p>
          <p>Month</p>
          <p>Day</p>
        </div>
      </div> */}

    </div>
  );
};

export default Handlers;
