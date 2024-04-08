import { useEffect, useRef, useState } from "react";

export default function Tree({ data, root }) {
  const ref = useRef(null);

  const [node, setNode] = useState(data);
  // node search
  // function getNode(id, node, edited) {
  //   if (node.id === id) {
  //     node.text = edited;
  //     return node;
  //   }
  //   if (node.firstChild !== null) getNode(id, node.firstChild);
  //   if (node.nextSibling !== null) getNode(id, node.nextSibling);
  // }
  // function getNodeById(root, id, edited) {
  //   if (root.id === id) {
  //     root.text = edited;
  //     return root;
  //   }
  //   if (root.firstChild !== null) return getNode(id, root.firstChild);
  //   return root;
  // }

  useEffect(() => {
    if (node.md_text) {
      let r = document.getElementById(node.id);
      r.innerHTML = node.md_text;
    }
  }, []);

  function callAPI() {
    fetch("http://localhost:3001/")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }));
  }

  const mutationObserver = new MutationObserver(async () => {
    if (ref.current) {
      let copy = node;
      copy.text = ref.current.innerText;
      setNode(copy);
      console.log(root);
    }
  });

  useEffect(() => {
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
  }, []);

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
      {node.firstChild && <Tree data={node.firstChild} root={root} />}
      {node.nextSibling && <Tree data={node.nextSibling} root={root} />}
    </div>
  );
}
