import { useEffect } from "react";
import TimelineEvent from "./TimelineEvent";

export default function Tree({ data }) {
  useEffect(() => {
    if (data.md_text) {
      let r = document.getElementById(data.id);
      r.innerHTML = data.md_text;
    }
  }, []);
  return (
    <>
      {data.type === "br" ? (
        <data.type key={data.id} />
      ) : (
        <data.type
          id={data.id}
          key={data.id}
          style={{
            marginLeft: data.indent + "em",
          }}
        >
          {data.text}
        </data.type>
      )}
      {data.firstChild && <Tree data={data.firstChild} />}
      {data.nextSibling && <Tree data={data.nextSibling} />}
    </>
  );
}
