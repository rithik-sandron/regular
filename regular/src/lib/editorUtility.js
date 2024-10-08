import { bold, date, reCheckBold, reCheckDate } from "./nodeType"
import { unicode } from "./generalUtility";

export function setCursor(e, index) {
  let range = document.createRange();
  let sel = window.getSelection();
  range.setStart(e.childNodes[0], index);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  e.focus();
}

function getCaret(element) {
  if (!element)
    return

  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

function getSelectedElement() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    let node = range.commonAncestorContainer;
    const type = node.nodeName;
    while (node) {
      if (node.nodeName === "P" || node.nodeName === "H1") {
        break;
      }
      node = node.parentNode;
    }
    return [node, type === "SPAN"];
  }
}

export function clear(activeId) {
  let p = document.getElementById(activeId.current);
  activeId.current = "";
  if (p.childNodes.length > 0) {
    p.childNodes.forEach(x => {
      if (x.nodeName === "MARK") {
        x.innerText = x.getAttribute("data-md");
      }
    })
  }
}

export function updateContent(node, activeId) {
  if (node) {
    activeId.current = node.id;
    if (node.childNodes.length > 0) {
      node.childNodes.forEach(x => {
        if (x.nodeName === "MARK") {
          x.innerText = x.getAttribute("data-text");
        }
      })
    }
  }
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
      attributeFilter: ['style', '']
    });
  }
}

export function pauseMutationObserver(mutationObserver) {
  if (mutationObserver.current) {
    mutationObserver.current.disconnect();
  }
}

export function toggleUntoggleDateContent(activeId, node) {
  if (activeId.current !== "" && activeId.current !== node.id) {
    clear(activeId)
    updateContent(node, activeId)
  } else if (activeId.current === "") {
    updateContent(node, activeId)
  }
}

export function handleClickAndKeyUp(e, mutationObserver, activeId, editor) {

  const res = getSelectedElement();
  const node = res[0];

  if (node) {
    pauseMutationObserver(mutationObserver);
    toggleUntoggleDateContent(activeId, node);

    let pos = getCaret(node);
    while (node.textContent.charCodeAt(pos) === 8205 || node.textContent.charCodeAt(pos) === 8203) {
      if (e.keyCode === 37)
        pos -= 1;
      else if (e.keyCode === 39)
        pos += 1;
    }
    setCaretAtIndex(node, pos);
    startMutationObserver(mutationObserver, editor);
  }
}

export function handleKeyUPDOWN(e, mutationObserver, activeId, editor) {
  const res = getSelectedElement();
  const node = res[0];
  toggleUntoggleDateContent(activeId, node);
}

export const navigate = (e, mutationObserver, activeId, editor, markdown) => {
  e.stopPropagation();
  switch (e.type) {
    case "click":
      handleClickAndKeyUp(e, mutationObserver, activeId, editor);
      break;

    case "keyup":
      if (!e.shiftKey && !e.ctrlKey && (e.keyCode === 37 || e.keyCode === 39))
        handleClickAndKeyUp(e, mutationObserver, activeId, editor);
      if (!e.shiftKey && !e.ctrlKey && (e.keyCode === 38 || e.keyCode === 40))
        handleKeyUPDOWN(e, mutationObserver, activeId, editor);
      break;

    case "keydown":
      switch (e.keyCode) {
        case 13:
          handleEnter(e, activeId, markdown);
          break;
        case 8:
          handleBackspace(e, activeId, mutationObserver, editor);
          break;
        case 9:
          handleTab(e, activeId);
          break;
      }
      break;
    case "input":
      handleTyping(e, mutationObserver, editor);
      break;
  }
}

export function getMutationObserver(mutate, activeId, resetInactivityTimer) {
  return new MutationObserver(async (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.nodeName === "MARK" || mutation.target.nodeName === "SPAN") {
        return
      }
      if (mutation.type === "childList") {
        if (mutation.target.nodeName !== "P" && mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach(node => {
            // delete mutation, no further action be done for this id after deletion.
            let existingNode = mutate.get(node.id);
            if (existingNode !== undefined) {
              existingNode.action = "delete";
              mutate.set(node.id, existingNode);
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
              mutate.set(node.id, {
                action: "add", parentId: mutation.previousSibling.previousSibling.id,
                text: node.textContent, level: document.getElementById(activeId.current) ?
                  parseFloat(document.getElementById(activeId.current).style.marginLeft) / 1.8 : 0
              });
            }
          })
        }

      } else if (mutation.type === "characterData") {
        // update mutation
        let existingNode = mutate.get(activeId.current);
        if (existingNode !== undefined) {
          existingNode.text = document.getElementById(activeId.current).innerText;
          mutate.set(activeId.current, existingNode);
        } else {
          mutate.set(activeId.current, { action: "update", id: activeId.current, text: document.getElementById(activeId.current).innerText });
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
    // console.log(mutate)
    resetInactivityTimer();
  });
}

const handleEnter = function (e, activeId, markdown) {
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
  // const cursorPoint = selection.anchorOffset;
  const cursorPoint = getCaret(getSelectedElement()[0])
  let textContent = unicode;
  if (cursorPoint < node.textContent.length) {
    // cursorPoint === node.textContent.length && node.textContent.length !== 0
    textContent = node.textContent.substring(cursorPoint, node.textContent.length);
    node.innerText = node.textContent.substring(0, cursorPoint).length > 0 ? node.textContent.substring(0, cursorPoint) : unicode;
  }

  // add br tag when enter is pressed
  const el = document.createElement("BR");
  range.deleteContents();
  node.insertAdjacentElement("afterend", el);
  range.setStartAfter(el);
  range.setEndAfter(el);
  selection.removeAllRanges();
  selection.addRange(range);
  createNewElement(e, range, tag, textContent, node, activeId, markdown);
}

function createNewElement(e, range, tag, textContent, node, activeId, markdown) {
  if (tag === "H1") {
    tag = "P"
  }
  const el = document.createElement(tag);
  el.innerText = textContent;
  markdown._uid += 1
  el.id = markdown._uid;
  activeId.current = el.id;
  el.style.marginLeft = node.style.marginLeft;
  range.deleteContents();
  range.insertNode(el)
  range.setStart(el, 0);
  range.setEnd(el, 0);
  e.stopPropagation();
  el.focus();
}

function setCaretAtIndex(element, index) {
  const range = document.createRange();
  const selection = window.getSelection();
  let currentPos = 0;
  let found = false;

  function searchNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (currentPos + node.length >= index) {
        range.setStart(node, index - currentPos);
        found = true;
      } else {
        currentPos += node.length;
      }
    } else {
      for (let child of node.childNodes) {
        if (found) break;
        searchNode(child);
      }
    }

  }
  searchNode(element);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
}

const handleBackspace = function (e, activeId, mutationObserver, editor) {
  const selection = window.getSelection();
  const res = getSelectedElement();
  const node = res[0];
  let pos = getCaret(node);
  if (res[1]) {
    reCheckBold(getCaret, setCaretAtIndex);
    reCheckDate(getCaret, setCaretAtIndex);
  }

  let selectedText = selection.toString();
  if (selectedText.length !== 0) {
    if (selectedText.length === node.textContent.length) {
      e.preventDefault();
      node.textContent = unicode;
      setCaretAtIndex(node, 0);
    }
  }
  else {
    let element = document.getElementById(activeId.current);
    if ((pos === 1 && !element.textContent.match(unicode)) || (pos === 2 && element.textContent.match(unicode))) {
      e.preventDefault();
      node.textContent = unicode;
      setCaretAtIndex(node, 0);
    } else if (pos < 2 && document.getElementById(activeId.current).nodeName !== "H1") {
      e.preventDefault();
      pauseMutationObserver(mutationObserver);
      element.previousElementSibling.remove();
      let content = element.innerText;
      let prev = element.previousElementSibling;
      clear(activeId)
      updateContent(prev, activeId);
      startMutationObserver(mutationObserver, editor);
      const pos = prev.textContent.length;
      if (content.length > 0 && content.charCodeAt(0) !== 8205) {
        prev.textContent = document.getElementById(activeId.current).textContent + content;
      }
      setCaretAtIndex(prev, pos);
      element.remove();
    }
  }
}

const handleTab = function (e, activeId) {
  e.preventDefault();
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

function handleTyping(e, mutationObserver, editor) {
  pauseMutationObserver(mutationObserver);
  if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    if (startContainer.nodeType === Node.TEXT_NODE && startContainer.parentNode.nodeName !== "SPAN") {
      const paragraph = startContainer.parentNode;
      let pos = getCaret(paragraph);
      const text = startContainer.textContent;

      bold(e, text, startContainer, paragraph, setCaretAtIndex, pos);
      date(e, text, startContainer, paragraph, setCaretAtIndex, pos);

    } else {
      reCheckBold(getCaret, setCaretAtIndex);
      reCheckDate(getCaret, setCaretAtIndex);
    }
  }
  startMutationObserver(mutationObserver, editor);
}