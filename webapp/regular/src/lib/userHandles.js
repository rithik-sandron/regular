import { regex } from "@/hooks/regex";

// export function handleClick(event) {
//   event.preventDefault();
//   event.stopPropagation();
//   let newContent = content;
//   setContent([
//     ...content,
//     { id: content.length, text: "# hello", markdown: "df" },
//   ]);
//   console.log(newContent);
// }

export function getCursor(ref) {
  var caretPos = 0,
    sel,
    range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == ref) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == ref) {
      var tempEl = document.createElement("span");
      ref.insertBefore(tempEl, ref);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

export function setCursor(ref, index) {
  let range = document.createRange();
  let sel = window.getSelection();
  range.setStart(ref.childNodes[0], index);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  ref.focus();
}

export async function handleChange(
  event,
  blocks,
  setBlocks,
  currentBlockIndex,
  currentBlockId,
  cursorPosition,
  ref
) {
  event.stopPropagation();
  const userSelection = window.getSelection();
  const selectedTextRange = userSelection.getRangeAt(0);
  // console.log(selectedTextRange.startContainer.parentElement);

  if (selectedTextRange.startContainer instanceof Text) {
    const text = selectedTextRange.startContainer.textContent.toString();
    regex.forEach((r) => {
      if (r.r.test(text)) {
        if (r.type === "hr") {
          const e = document.createDocumentFragment(r.type);
          const transformedText = text.replace(r.r, "");
          let pos = getCursor(selectedTextRange.startContainer.parentElement);
          selectedTextRange.startContainer.parentElement.replaceWith(e);
          const diff = text.length - transformedText.length;
          console.log(pos, diff);
          if (pos >= diff) pos -= diff;
          cursorPosition.current = pos;
          setCursor(e, pos);
          // ref.current = selectedTextRange.startContainer.parentElement;
          // currentBlockIndex.current = selectedTextRange.startContainer.parentElement.getAttribute();
          // currentBlockId.current =
          //   selectedTextRange.startContainer.parentElement.id;
          // input.type = r.type;
          // input.text = event.target.innerText.replace(r.r, "");

          // blocksCopy[currentBlockIndex.current] = input;
          // setBlocks([...blocksCopy]);
          return;
        } else {
          const e = document.createElement(r.type);
          const transformedText = text.replace(r.r, "");
          e.appendChild(document.createTextNode(transformedText));
          let pos = getCursor(selectedTextRange.startContainer.parentElement);
          selectedTextRange.startContainer.parentElement.replaceWith(e);
          const diff = text.length - transformedText.length;
          console.log(pos, diff);
          if (pos >= diff) pos -= diff;
          cursorPosition.current = pos;
          setCursor(e, pos);
          // ref.current = selectedTextRange.startContainer.parentElement;
          // currentBlockIndex.current = selectedTextRange.startContainer.parentElement.getAttribute();
          // currentBlockId.current =
          //   selectedTextRange.startContainer.parentElement.id;
          // input.type = r.type;
          // input.text = event.target.innerText.replace(r.r, "");

          // blocksCopy[currentBlockIndex.current] = input;
          // setBlocks([...blocksCopy]);
          return;
        }
      }
    });
  }

  console.log(document.getElementById("m-list"));

  // const text = event.target.innerText;
  // let blocksCopy = blocks;

  // let input = blocksCopy[currentBlockIndex.current];
  // let isChanged = true;
  // if (text !== "") {
  //   regex.forEach((r) => {
  //     if (r.r.test(text) && input.type !== r.type) {
  //       console.log("alled")
  //       input.type = r.type;
  //       input.text = event.target.innerText.replace(r.r, "");
  //       input.cursor = 0;
  //       if (input.text.length === 0) input.text = " ";
  //       blocksCopy[currentBlockIndex.current] = input;
  //       setBlocks([...blocksCopy]);
  //       isChanged = false;
  //       return;
  //     }
  //   });

  //   if (isChanged) {
  //     input.text = event.target.innerText;
  //     blocksCopy[currentBlockIndex.current] = input;
  //     input.cursor = getCursor(ref);
  //     setBlocks([...blocksCopy]);
  //   }
  // }
}

export async function handleKeyup(
  event,
  blocks = [],
  setBlocks,
  currentBlockIndex,
  setCurrentBlockId
) {}

export async function handleKeydown(e) {
  // if (37 === event.which) {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   let blocksCopy = blocks;
  //   if (blocksCopy[currentBlockIndex.current].cursor !== 0) {
  //     let input = blocksCopy[currentBlockIndex.current];
  //     input.cursor -= 1;
  //     blocksCopy[currentBlockIndex.current] = input;
  //     setBlocks([...blocksCopy]);
  //   }
  // } else if (39 === event.which) {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   let blocksCopy = blocks;
  //   if (
  //     blocksCopy[currentBlockIndex.current].cursor <
  //     blocksCopy[currentBlockIndex.current].text.length
  //   ) {
  //     let input = blocksCopy[currentBlockIndex.current];
  //     input.cursor += 1;
  //     blocksCopy[currentBlockIndex.current] = input;
  //     setBlocks([...blocksCopy]);
  //   }
  // }

  if (38 === e.which) {

    console.log(e);
  } else if (40 === e.which) {
    e.stopPropagation();
    e.preventDefault();
  }

  // if (event.which === 13) {
  //   event.stopPropagation();
  //   // event.preventDefault();

  //   const userSelection = window.getSelection();
  //   const selectedTextRange = userSelection.getRangeAt(0);
  //   console.log(selectedTextRange);
  //   console.log(getCursor(selectedTextRange));

  //   let copy = blocks;
  //   console.log(event);
  //   const index = currentBlockIndex.current;
  //   const input = {
  //     id: blocks.length,
  //     type: "p",
  //     text: " ",
  //     cursor: 1,
  //   };
  //   copy.splice(index + 1, 0, input);
  //   setBlocks([...copy]);
  //   // setCurrentBlockId(input.id);
  //   currentBlockIndex.current = index + 1;
  // }

  // if (event.which === 8) {
  //   event.stopPropagation();
  //   let blocksCopy = blocks;
  //   let input = blocksCopy[currentBlockIndex.current];
  //   if (blocks[currentBlockIndex.current].type !== "p") {
  //     input.type = "p";
  //     if (input.text.length === 0) input.text = " ";
  //     input.cursor = 0;
  //     blocksCopy[currentBlockIndex.current] = input;
  //     console.log(input);
  //     setBlocks([...blocksCopy]);
  //   }
  // }
}
