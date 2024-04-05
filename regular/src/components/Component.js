import React from "react";

const Component = ({ input }) => {
  return input.type === "br" ? (
    <div>
      {React.createElement(
        input.type,
        {
          key: input.text && input.id,
        },
        input.text
      )}
    </div>
  ) : (
    <>
      {React.createElement(
        input.type,
        {
          key: input.text && input.id,
        },
        input.text
      )}
    </>
  );
};

export default Component;
