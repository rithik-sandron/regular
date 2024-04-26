import { useEffect, useRef, useState } from "react";

export default function Tree({ data, root, p }) {
  const ref = useRef(null);

  const [node, setNode] = useState(data);

  function getPos(e) {
    let _range = document.getSelection().getRangeAt(0);
    let range = _range.cloneRange();
    range.selectNodeContents(e);
    range.setEnd(_range.endContainer, _range.endOffset);
    console.log(range.toString().length);
    // return range.toString().length;
  }

  function navigate(e) {
    e.preventDefault();
    e.stopPropagation();
    let n = window.getSelection()?.focusdata?.parentElement;
    if (data._has_dates) {
      console.log(data._text);
    }
    // if (data._date1 && ref.current && n && ref.current.id === n.parentdata.id) {
    //   let r = document.getElementById(data._id);
    //   r.innerHTML = data._md_text;
    //   getPos(window.getSelection().focusNode);
    //   // ref.current.focus();
    // } else if (ref.current && data._date1) {
    //   let r = document.getElementById(data._id);
    //   r.innerHTML = data._text;
    //   // ref.current.focus();
    // }
  }

  useEffect(() => {
    // document.addEventListener("keydown", navigate);
    document.addEventListener("click", (e) => navigate(e));
    if (data._md_text) {
      ref.current.innerHTML = data._md_text;
    }
  }, [data._id, data._md_text]);

  // useEffect(() => {
  //   const mutationObserver = new MutationObserver(async () => {
  //     if (ref.current) {
  //       let copy = node;
  //       copy.text = ref.current.innerText;
  //       copy.isUpdated = true;
  //       setNode(copy);
  //       p(root);
  //     }
  //   });
  //   if (ref.current) {
  //     mutationObserver.observe(ref.current, {
  //       childList: true,
  //       subtree: true,
  //       characterData: true,
  //       attributeOldValue: true,
  //     });

  //     return () => {
  //       mutationObserver.disconnect();
  //     };
  //   }
  // }, [node, root, p]);

  return (
    data._type && (
      <>
        {data._type === "br" ? (
          <data._type
            id={data._id}
            key={data._id}
            ref={ref}
            style={{
              marginLeft: data._indent + "em",
            }}
          />
        ) : (
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
        )}
        {data._first_child && (
          <Tree data={data._first_child} root={root} p={p} />
        )}
        {data._next_sibling && (
          <Tree data={data._next_sibling} root={root} p={p} />
        )}
      </>
    )
  );
}
