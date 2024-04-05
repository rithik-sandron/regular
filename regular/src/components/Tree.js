import { useEffect } from "react";

export default function Tree({ data }) {
  const re = data.md_text;

  useEffect(() => {
    let r = document.getElementById(data.id);
    r.innerHTML = re;
  }, []);
  return (
    <>
      <p
        id={data.id}
        style={{
          marginLeft: data.indent + "em",
        }}
      />
      {data.firstChild && <Tree data={data.firstChild} />}
      {data.nextSibling && <Tree data={data.nextSibling} />}
    </>
  );
}
