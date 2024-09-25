const AppLayout = ({ header, children }) => {
  return (
    <main>

      <header>{header}</header>
      {children}

    </main>
  );
};

export default AppLayout;
