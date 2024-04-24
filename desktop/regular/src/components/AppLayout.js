import Navigation from "./Navigation";

const AppLayout = ({ header, children }) => {
  return (
    <div className="app-container">
      {/* <Navigation title={"Regular"} /> */}
      {/* <header>{header}</header> */}
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
