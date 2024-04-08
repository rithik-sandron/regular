import { useEffect, useRef, useState } from "react";

export default function Tree({ data, root, p }) {
  const ref = useRef(null);

  const [node, setNode] = useState(data);

  useEffect(() => {
    if (node.md_text) {
      let r = document.getElementById(node.id);
      r.innerHTML = node.md_text;
    }
  }, [node.id, node.md_text]);

  useEffect(() => {
    const mutationObserver = new MutationObserver(async () => {
      if (ref.current) {
        let copy = node;
        copy.text = ref.current.innerText;
        copy.isUpdated = true;
        setNode(copy);
        p(root);
      }
    });
    if (ref.current) {
      mutationObserver.observe(ref.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributeOldValue: true,
      });

      return () => {
        mutationObserver.disconnect();
      };
    }
  }, [node, root, p]);

  return (
    <div>
      {node.type === "br" ? (
        <node.type key={node.id} />
      ) : (
        <node.type
          id={node.id}
          key={node.id}
          ref={ref}
          style={{
            marginLeft: node.indent + "em",
          }}
        >
          {node.text}
        </node.type>
      )}
      {node.firstChild && <Tree data={node.firstChild} root={root} p={p} />}
      {node.nextSibling && <Tree data={node.nextSibling} root={root} p={p} />}
    </div>
  );
}
