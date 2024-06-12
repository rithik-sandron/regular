import Navigation from "./Navigation";

const AppLayout = ({ header, children }) => {
  return (
    <main>
      <div className="app-container">
        {/* <Navigation title={"Regular"} /> */}
        {/* <header>{header}</header> */}
        {children}
      </div>
    </main>
  );
};

export default AppLayout;
