const AppLayout = ({ header, children }) => {
  return (
    <main>
      <div className="app-container">
        <header>{header}</header>
        {children}
      </div>
    </main>
  );
};

export default AppLayout;
