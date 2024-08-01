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
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    return node;
  }
}

const uuid = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};

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
      attributeFilter: ['style', '']
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

export function handleClickAndKeyUp(e, mutationObserver, activeId, editor) {
  pauseMutationObserver(mutationObserver);
  toggleUntoggleDateContent(activeId, fetchActiveNode());
  startMutationObserver(mutationObserver, editor);
}

export const navigate = (e, mutationObserver, activeId, editor) => {
  e.stopPropagation();
  switch (e.type) {
    case "click":
      // console.log("[click] event triggered")
      handleClickAndKeyUp(e, mutationObserver, activeId, editor);
      break;

    case "keyup":
      // console.log("[keyup] event triggered")
      if (e.keyCode > 36 && e.keyCode < 41)
        handleClickAndKeyUp(e, mutationObserver, activeId, editor);
      break;

    case "keydown":
      // console.log("[keydown] event triggered")
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
    case "input":
      // console.log("[input] event triggered")
      handleTyping(e);
      break;
  }
}

export function getMutationObserver(mutate, activeId) {
  return new MutationObserver(async (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.nodeName === "MARK") {
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
        let existingNode = mutate.get(activeId.current);
        if (existingNode !== undefined) {
          // existingNode.text = document.getElementById(activeId.current).outerText;
          mutate.set(activeId.current, existingNode);
        } else {
          // mutate.set(activeId.current, { action: "update", id: activeId.current, text: document.getElementById(activeId.current).outerText });
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
  // const cursorPoint = selection.anchorOffset;
  const cursorPoint = getCaret(getSelectedElement())
  let textContent = "\u200D";
  if (cursorPoint < node.textContent.length) {
    // cursorPoint === node.textContent.length && node.textContent.length !== 0
    textContent = node.textContent.substring(cursorPoint, node.textContent.length);
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
  createNewElement(e, range, tag, textContent, node, activeId);
}

function createNewElement(e, range, tag, textContent, node, activeId) {
  if (tag === "H1") {
    tag = "P"
  }
  const el = document.createElement(tag);
  el.innerText = textContent;
  el.id = uuid();
  activeId.current = el.id;
  el.style.marginLeft = node.style.marginLeft;
  range.deleteContents();
  range.insertNode(el)
  range.setStart(el, 0);
  range.setEnd(el, 0);
  e.stopPropagation();
  el.focus();
}

// function removeContent(e, activeId, mutationObserver, editor) {
//   e.preventDefault();
//   let element = document.getElementById(activeId.current);
//   pauseMutationObserver(mutationObserver);
//   if (element.nodeName === "H1") {
//     element.textContent = "\u200D";
//     startMutationObserver(mutationObserver, editor);
//   } else {
//     element.previousElementSibling.remove();
//     let content = element.innerText.substring(1);
//     let prev = element.previousElementSibling;
//     clear(activeId)
//     updateContent(prev, activeId);
//     startMutationObserver(mutationObserver, editor);
//     const pos = prev.textContent.length;

//     prev.textContent = document.getElementById(activeId.current).textContent + content;
//     setCursor(prev, pos);
//     element.remove();
//   }
// }
//
// const handleBackspace = function (e, activeId, mutationObserver, editor) {
//   const selection = window.getSelection();
//   const node = getSelectedElement();
//   let cursorPoint = getCaret(node);
//   let selectedText = selection.toString();
//   // console.log(cursorPoint, node.textContent.length, node.textContent.charCodeAt(1))
//   // default behavior deletes last char and p tag entirely 
//   if ((node.textContent.length !== 1 && node.textContent.length === selectedText.length)
//     || (cursorPoint === 1 && node.textContent.charCodeAt(0) !== 8205)
//     || (cursorPoint === 2 && node.textContent.charCodeAt(1) === 8205)) {
//     e.preventDefault();
//     node.textContent = "\u200D";
//   } else if (cursorPoint === 0 || cursorPoint === 1 || (cursorPoint === 2 && node.textContent.charCodeAt(0) !== 8205)) {
//     removeContent(e, activeId, mutationObserver, editor, node);
//   } else {
//     findNonUniChar(cursorPoint, node);
//   }
// }

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
  // setTimeout(() => {
  pauseMutationObserver(mutationObserver);
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const currentNode = range.startContainer;

  if (currentNode.parentNode.nodeName === 'SPAN') {
    let p = currentNode.parentNode.parentNode.parentNode;
    const pos = getCaret(p);
    // console.log(p.textContent.charAt(pos) - 1)

    let prev = currentNode.parentNode.parentNode.previousSibling;
    let prevLength = prev.textContent.length;
    if (prev) {
      prev.textContent = prev.textContent + currentNode.parentNode.parentNode.textContent;
    } else {

    }
    p.removeChild(currentNode.parentNode.parentNode);
    setCaretAtIndex(p, pos);

  } else {
    let p = currentNode.parentNode;
    const pos = getCaret(p);
    // console.log(p.textContent.charAt(pos) - 1)
  }
  startMutationObserver(mutationObserver, editor);
  // }, 0)

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

function handleTyping(e) {
  if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    if (startContainer.nodeType === Node.TEXT_NODE && startContainer.parentNode.nodeName !== "SPAN") {
      const paragraph = startContainer.parentNode;
      let pos = getCaret(paragraph);
      const text = startContainer.textContent;
      const boldRegex = /\*\*(.+?)\*\*/g;
      let match;
      if (match = boldRegex.exec(text)) {
        var start = match.index;
        var end = boldRegex.lastIndex;
        e.preventDefault();
        e.stopPropagation();
        console.log(startContainer.textContent.substring(end, startContainer.textContent.length).charCodeAt(0))
        let text = startContainer.textContent.slice(start, end);
        let b = document.createElement('span');
        b.className = "bold-wrapper";
        b.innerHTML = `<span class="asterisk">${text.slice(0, 2)}</span><strong>${match[0].slice(2, -2)}</strong><span class="asterisk">${text.slice(-2)}</span>`
        let last = paragraph.insertBefore(document.createTextNode('\u200B' + startContainer.textContent.substring(end, startContainer.textContent.length)), startContainer);
        paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start) + '\u200B'), last);
        paragraph.insertBefore(b, last);
        paragraph.removeChild(startContainer);
        setCaretAtIndex(paragraph, pos + 2);
      }
    } else {
      const paragraph = startContainer.parentNode.parentNode;
      const text = paragraph.textContent;
      const boldRegex = /\*\*(.+?)\*\*/g;
      let match;
      if (match = boldRegex.exec(text) && paragraph.nodeName !== 'SPAN') {
        var start = match.index;
        var end = boldRegex.lastIndex;
        let text = paragraph.textContent.slice(start, end);
        let b = document.createElement('span');
        b.className = "bold-wrapper";
        b.innerHTML = `<span class="asterisk">${text.slice(0, 2)}</span><strong>${match[0].slice(2, -2)}</strong><span class="asterisk">${text.slice(-2)}</span>`
        let last = paragraph.insertBefore(document.createTextNode('\u200B' + paragraph.textContent.substring(end, paragraph.textContent.length)), startContainer.parentNode);
        paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start) + '\u200B'), last);
        paragraph.insertBefore(b, last);
        paragraph.removeChild(startContainer.parentNode);
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
          range.selectNodeContents(paragraph);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
          var textRange = document.body.createTextRange();
          textRange.moveToElementText(paragraph);
          textRange.collapse(false);
          textRange.select();
        }
      } else if (paragraph.nodeName === 'SPAN') {
        let outerP = paragraph.parentNode;
        const pos = getCaret(outerP);
        outerP.insertBefore(document.createTextNode(paragraph.textContent), paragraph);
        outerP.removeChild(paragraph)
        setCaretAtIndex(outerP, pos);
      }
    }
  }
}