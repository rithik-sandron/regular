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
  let p = document.getElementById(activeId.current);
  activeId.current = "";
  p.childNodes.forEach(x => {
    if (x.nodeName === "MARK") {
      x.innerText = x.getAttribute("data-md");
    }
  })
}

export function updateContent(node, activeId) {
  activeId.current = node.id;
  node.childNodes.forEach(x => {
    if (x.nodeName === "MARK") {
      x.innerText = x.getAttribute("data-text");
    }
  })
}

export function startMutationObserver(mutationObserver, editor) {
  if (editor.current) {
    mutationObserver.current.observe(editor.current, {
      characterData: true,
      subtree: true,
      childList: true,
      attributeOldValue: true,
      characterDataOldValue: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }
}

export function pauseMutationObserver(mutationObserver) {
  if (mutationObserver.current) {
    mutationObserver.current.disconnect();
  }
}

export function fetchActiveNode() {
  const selection = window.getSelection();
  let node = selection.anchorNode.parentNode;
  if (selection.anchorNode.parentNode.nodeName === "MARK") {
    node = selection.focusNode.parentNode.parentNode;
  }
  return node;
}

export function toggleUntoggleDateContent(activeId, node) {
  if (activeId.current !== "" && activeId.current !== node.id) {
    clear(activeId)
    updateContent(node, activeId)
  } else if (activeId.current === "") {
    updateContent(node, activeId)
  }
}

export function action(mutationObserver, activeId, editor) {
  pauseMutationObserver(mutationObserver);
  toggleUntoggleDateContent(activeId, fetchActiveNode());
  startMutationObserver(mutationObserver, editor);
}

export const navigate = (e, mutationObserver, activeId, editor) => {
  e.stopPropagation();
  switch (e.type) {
    case "click":
      action(mutationObserver, activeId, editor);
      break;

    case "keyup":
      // !e.altKey && !e.shiftKey &&
      if (e.keyCode > 36 && e.keyCode < 41)
        action(mutationObserver, activeId, editor);
      break;

    case "keydown":
      switch (e.keyCode) {
        case 13:
          handleEnter(e, activeId);
          break;
        case 8:
          handleBackspace(e, activeId, mutationObserver, editor);
          break;
        case 9:
          handleTab(e, activeId);
          break;
      }
      break;
  }
}

export function getMutationObserver(mutate, activeId) {
  return new MutationObserver(async (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {

        if (mutation.target.nodeName !== "P" && mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach(node => {
            // delete mutation, no further action be done for this id after deletion.
            let existingNode = mutate.get(node.id);
            if (existingNode !== undefined) {
              existingNode.action = "delete";
              mutate.set(node.id, existingNode);
            } else {
              mutate.set(node.id, { action: "delete" });
            }
          })
        }

        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (mutation.target.nodeName === "P" || node.nodeType === 3) {
              // add mutation
              let existingNode = mutate.get(mutation.target.id);
              if (existingNode !== undefined) {
                existingNode.text = node.textContent;
                mutate.set(mutation.target.id, existingNode);
              } else {
                mutate.set(mutation.target.id, { action: "update", parentId: mutation.target.id, text: node.textContent });
              }
            } else if (node.nodeName !== "BR") {
              mutate.set(node.id, { action: "add", parentId: mutation.previousSibling.previousSibling.id, text: node.textContent, level: document.getElementById(activeId.current) ? parseFloat(document.getElementById(activeId.current).style.marginLeft) / 1.8 : 0 });
            }
          })
        }

      } else if (mutation.type === "characterData") {
        // update mutation
        let existingNode = mutate.get(mutation.target.parentNode.id);
        if (existingNode !== undefined) {
          existingNode.text = mutation.target.textContent;
          mutate.set(mutation.target.parentNode.id, existingNode);
        } else {
          mutate.set(mutation.target.parentNode.id, { action: "update", id: mutation.target.parentNode.id, text: mutation.target.textContent });
        }

      } else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        let value = "";
        if (mutation.oldValue > mutation.target.style.cssText) {
          value = -1;
        } else {
          value = 1;
        }

        let existingNode = mutate.get(activeId.current);
        if (existingNode !== undefined) {
          existingNode.level = (existingNode.level ? existingNode.level : 0) + value;
          mutate.set(activeId.current, existingNode);
        } else {
          mutate.set(activeId.current, { action: "tab", id: activeId.current, level: value });
        }
      }
    })
    // console.log(mutate);
  });
}

const handleEnter = function (e, activeId) {
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
  createNewElement(e, range, tag, selection, el, textContent, node, activeId);
}

function createNewElement(e, range, tag, selection, n, textContent, node, activeId) {
  const el = document.createElement(tag);
  el.id = uuid();
  activeId.current = el.id;
  el.style.marginLeft = node.style.marginLeft;
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
  el.focus();
}

const uuid = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};

const handleBackspace = function (e, activeId, mutationObserver, editor) {
  const selection = window.getSelection();
  let range = selection.getRangeAt(0);

  if ((selection.focusOffset === 0 && selection.anchorOffset === 1)
    || (selection.anchorOffset < 2 && selection.anchorNode.textContent.length === selection.focusOffset)
    || (selection.focusOffset < 1 && selection.anchorNode.textContent.length === selection.anchorOffset)) {
    e.preventDefault();
    range.startContainer.textContent = "\u200D";
  } else if ((selection.focusOffset === 0 && selection.anchorOffset === 0) || selection.focusNode.textContent.length === 1) {
    e.preventDefault()

    let p = document.getElementById(activeId.current);
    pauseMutationObserver(mutationObserver);
    p.previousElementSibling.remove();
    let content = p.innerText;
    let prev = p.previousElementSibling;
    clear(activeId)
    updateContent(prev, activeId);
    startMutationObserver(mutationObserver, editor);

    const pos = prev.textContent.length;
    prev.textContent = document.getElementById(activeId.current).textContent + content;
    setCursor(prev, pos);
    p.remove();
  }
}

const handleTab = function (e, activeId) {
  e.preventDefault();

  const selection = window.getSelection();
  let node = selection.anchorNode.parentNode;
  if (selection.anchorNode.parentNode.nodeName === "MARK") {
    node = selection.focusNode.parentNode.parentNode;
  }
  let p = document.getElementById(activeId.current);
  const prev = p?.previousElementSibling?.previousElementSibling;
  if (e.shiftKey) {
    if (prev && prev.nodeName !== "H1" && p.style.marginLeft !== "0em") {
      p.style.marginLeft = parseFloat(p.style.marginLeft) - 1.8 + "em";
    }
  } else {
    if (prev && prev.nodeName !== "H1" && prev.style.marginLeft >= p.style.marginLeft && p.nodeName === 'P') {
      p.style.marginLeft = parseFloat(p.style.marginLeft) + 1.8 + "em";
    }
  }
}