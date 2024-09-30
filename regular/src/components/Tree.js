import { useEffect, useRef } from "react";

export default function Tree({ data }) {

  const ref = useRef(null);
  useEffect(() => {
    if (data._md_text) {
      ref.current.innerHTML = data._md_text;
    }
  }, [data._md_text]);

  return (
    data._type && (
      <>
        {data._type === "br" ? (
          <>
            <p
              id={data._id}
              key={data._id}
              ref={ref}
              style={{
                marginLeft: data._indent + "em",
              }}>
            </p>
            <data._type />
          </>
        ) : (
          <>
            <data._type
              id={data._id}
              key={data._id}
              ref={ref}
              style={{
                marginLeft: data._indent + "em",
              }}
            >
              {data._text}
            </data._type>
            <br />
          </>
        )}
        {data._first_child && (
          <Tree data={data._first_child} />
        )}
        {data._next_sibling && (
          <Tree data={data._next_sibling} />
        )}
      </>
    )
  );
}
