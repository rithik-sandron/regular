const TopComponent = ({ setComponent, component }) => {

  function handleClick(e) {
    e.stopPropagation();
    // e.preventDefault();
    e.target.removeAttribute('checked');
    console.log(e.targer)
    setComponent(() => !component);
  }

  return (
    <label className="toggle-switch" >
      <input type="checkbox" onClick={(e) => handleClick(e)} />
      <span className="slider" />
    </label>
  );
};

export default TopComponent;
