import { useEffect, useRef, useState } from "react";

export default function Tree({ data, root, p }) {
  const ref = useRef(null);

  const [node, setNode] = useState(data);

  function getPos(e) {
    let _range = document.getSelection().getRangeAt(0);
    let range = _range.cloneRange();
    range.selectNodeContents(e);
    range.setEnd(_range.endContainer, _range.endOffset);
    console.log(range.toString().length)
    // return range.toString().length;
  }

  function myFunction() {
    let n = window.getSelection().focusNode.parentElement;
    if (ref.current && ref.current.id === n.parentNode.id) {
      let r = document.getElementById(node.id);
      r.innerHTML = node.text;
      getPos(window.getSelection().focusNode);
      ref.current.focus();
    } else if (ref.current) {
      let r = document.getElementById(node.id);
      r.innerHTML = node.md_text;
      ref.current.focus();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", myFunction);
    document.addEventListener("click", myFunction);
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
    <>
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
    </>
  );
}
