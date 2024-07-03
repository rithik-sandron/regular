export function setCursor(ref, index) {
  let range = document.createRange();
  let sel = window.getSelection();
  range.setStart(ref.childNodes[0], index);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  ref.focus();
}

export function getCursor(e) {
  let _range = document.getSelection().getRangeAt(0);
  let range = _range.cloneRange();
  range.selectNodeContents(e);
  range.setEnd(_range.endContainer, _range.endOffset);
  return range.toString();
}

export function clear(activeId) {
  let date = document.getElementById(activeId.current);
  date.innerText = date.getAttribute("data-md");
  activeId.current = "";
}

export function updateDuringClick(e, activeId) {
  activeId.current = e.target.id
  e.target.innerText = e.target.getAttribute("data-text");
}

export function updateDuringKeyDown(selection, activeId) {
  activeId.current = selection.focusNode.parentNode.id;
  selection.focusNode.parentNode.innerText = selection.focusNode.parentNode.getAttribute("data-text")
}

export function startMutationObserver(mutationObserver, editor) {
  if (editor.current) {
    mutationObserver.current.observe(editor.current, {
      characterData: true,
      subtree: true,
      childList: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  }
}

export function pauseMutationObserver(mutationObserver) {
  if (mutationObserver.current) {
    mutationObserver.current.disconnect();
  }
}

export const navigate = (e, mutationObserver, activeId, editor) => {
  e.stopPropagation();
  switch (e.type) {
    case "click":
      pauseMutationObserver(mutationObserver);
      if (e.target.nodeName === "MARK") {
        if (activeId.current !== "" && activeId.current !== e.target.id) {
          clear(activeId)
          updateDuringClick(e, activeId)
        } else if (activeId.current === "") {
          updateDuringClick(e, activeId)
        } 
      } else if (activeId.current !== "") {
        clear(activeId);
      }
      startMutationObserver(mutationObserver, editor);
      break;

    case "keydown":
      if (e.keyCode > 36 && e.keyCode < 41) {
        
        pauseMutationObserver(mutationObserver);
        const selection = window.getSelection();
        console.log(selection)
        if (selection.focusNode.parentNode.nodeName === "MARK") {
          if (activeId.current !== "" && activeId.current !== selection.focusNode.parentNode.id) {
            clear(activeId);
            updateDuringKeyDown(selection, activeId);
          } else if (activeId.current === "") {
            updateDuringKeyDown(selection, activeId);
          }
        } else if (activeId.current !== "") {
          clear(activeId)
        }
        startMutationObserver(mutationObserver, editor);
      }
      else if (e.keyCode === 13) {
        handleEnter(e)
      }
      else if (e.keyCode === 8) {
        handleBackspace(e)
      }
      break;
  }
}

export function getMutationObserver(mutate) {
  return new MutationObserver(async (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        if (mutation.target.nodeName !== "P" && mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach(node => {
            let existingNode = mutate.get(node.id);
            if (existingNode !== undefined) {
              existingNode.action = "delete";
              mutate.set(node.id, existingNode);
            } else {
              mutate.set(node.id, { action: "delete", id: node.id });
            }
          })
        }

        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (mutation.target.nodeName === "P" || node.nodeType === 3) {
              let existingNode = mutate.get(mutation.target.id);
              if (existingNode !== undefined) {
                existingNode.text = node.textContent;
                mutate.set(mutation.target.id, existingNode);
              } else {
                mutate.set(mutation.target.id, { action: "update", parentId: mutation.target.id, text: node.textContent });
              }
            } else if (node.nodeName !== "BR") {
              let existingNode = mutate.get(node.id);
              if (existingNode !== undefined) {
                existingNode.text = node.textContent;
                if (existingNode.action === "delete") {
                  mutate.set(node.id, { action: "update", parentId: mutation.previousSibling.previousSibling.id, text: node.textContent });
                }
              } else {
                mutate.set(node.id, { action: "add", parentId: mutation.previousSibling.previousSibling.id, text: node.textContent });
              }
            }
          })
        }

      } else if (mutation.type === "characterData") {
        let existingNode = mutate.get(mutation.target.parentNode.id);
        if (existingNode !== undefined) {
          existingNode.text = mutation.target.textContent;
          mutate.set(mutation.target.parentNode.id, existingNode);
        } else {
          mutate.set(mutation.target.parentNode.id, { action: "update", id: mutation.target.parentNode.id, text: mutation.target.textContent });
        }

      }
    })
    // console.log(mutate);
  });
}

const handleEnter = function (e) {
  e.preventDefault();
  const selection = window.getSelection();
  let range = selection.getRangeAt(0);
  let nodeType = selection.getRangeAt(0).startContainer.nodeType;
  let node = "P";
  if (nodeType === 3) {
    node = selection.getRangeAt(0).startContainer.parentElement;
  } else {
    node = selection.getRangeAt(0).startContainer;
  }
  let tag = node.nodeName;
  const cursorPoint = selection.anchorOffset;
  let textContent = "\u200D";
  if (cursorPoint < node.textContent.length) {
    // cursorPoint === node.textContent.length && node.textContent.length !== 0
    textContent += node.textContent.substring(cursorPoint, node.textContent.length);
    node.innerText = node.textContent.substring(0, cursorPoint).length > 0 ? node.textContent.substring(0, cursorPoint) : "\u200D";
  }

  // add br tag when enter is pressed
  const el = document.createElement("BR");
  range.deleteContents();
  node.insertAdjacentElement("afterend", el);
  range.setStartAfter(el);
  range.setEndAfter(el);
  selection.removeAllRanges();
  selection.addRange(range);
  createNewElement(e, range, tag, selection, el, textContent);
}

function createNewElement(e, range, tag, selection, n, textContent) {
  const el = document.createElement(tag);
  el.id = uuid();
  el.style.marginLeft = "0.4em";
  range.deleteContents();
  range.setStart(el, 0);
  range.setEnd(el, 0);
  const ze = document.createTextNode(textContent);
  range.insertNode(ze);
  range.setStartBefore(ze);
  range.setEndBefore(ze);
  n.insertAdjacentElement("afterend", el);
  selection.removeAllRanges();
  selection.addRange(range);
  e.stopPropagation();
  el.focus()
}

const uuid = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};

const handleBackspace = function (e) {
  // e.preventDefault();
  const selection = window.getSelection();
  let range = selection.getRangeAt(0);
  let nodeType = selection.getRangeAt(0).startContainer.nodeType;

  if ((selection.focusOffset === 0 && selection.anchorOffset === 1)
    || (selection.anchorOffset < 2 && selection.anchorNode.textContent.length === selection.focusOffset)
    || (selection.focusOffset < 1 && selection.anchorNode.textContent.length === selection.anchorOffset)) {
    e.preventDefault();
    range.startContainer.textContent = "\u200D";
  } else if (selection.focusOffset === 0 && selection.anchorOffset === 0) {
    e.preventDefault()
    let nodeType = range.startContainer.nodeType;
    let node = "P";
    if (nodeType === 3) {
      node = range.startContainer.parentElement;
    } else {
      node = range.startContainer;
    }
    console.log(node.innerHTML)
  }
}