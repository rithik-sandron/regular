
import { useEffect, useState, useMutationObserver } from "react";

export default function Tree({ data }) {
  useEffect(() => {
    if (data.md_text) {
      let r = document.getElementById(data.id);
      r.innerHTML = data.md_text;
    }
  }, []);

  // const mutationObserver = new MutationObserver(async () => {
  //   console.log('mutationObserver operation');
  // });

  // useEffect(() => {
  //   mutationObserver.observe(document.getElementById(node.id), {
  //     childList: true,
  //     subtree: true,
  //   });

  //   return () => {
  //     mutationObserver.disconnect();
  //   };
  // }, []);

  const [node, setNode] = useState(data);

  // function handleChange(e) {
  //   console.log("hello");
  // }

  return (
    <div>
      {node.type === "br" ? (
        <node.type key={node.id} />
      ) : (
        <node.type
          id={node.id}
          key={node.id}
          onInput={(e) => handleChange(e)}
          style={{
            marginLeft: node.indent + "em",
          }}
        >
          {node.text}
        </node.type>
      )}
      {node.firstChild && <Tree data={node.firstChild} />}
      {node.nextSibling && <Tree data={node.nextSibling} />}
    </div>
  );
}
