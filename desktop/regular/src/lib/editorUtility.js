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
}

export function updateDuringClick(e, activeId) {
  activeId.current = e.target.id
  e.target.innerText = e.target.getAttribute("data-text");
}

export function updateDuringKeyDown(selection, activeId) {
  activeId.current = selection.focusNode.parentNode.id;
  selection.focusNode.parentNode.innerText = selection.focusNode.parentNode.getAttribute("data-text")
}

export const navigate = (e, mutationObserver, activeId, editor) => {
  e.stopPropagation();
  if (mutationObserver.current) {
    mutationObserver.current.disconnect();
  }

  if (e.type === "click") {
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
  } else if (e.type === "keydown" && e.keyCode > 36 && e.keyCode < 41) {
    const selection = window.getSelection();
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
  }

  if (mutationObserver.current) {
    mutationObserver.current.observe(editor.current, {
      childList: true,
      characterData: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  }
}

export function getMutationObserver() {
  return new MutationObserver(async (mutations) => {
    let mutate = [];
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        if (mutation.removedNodes.length > 0) {
          mutate.push({ action: 'delete', nodes: [...mutation.removedNodes] });
        }

        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            let isAfter = true;
            if (node.id === mutation.nextSibling.id) {
              isAfter = false;
            }
            if (node.textContent !== "") {
              mutate.push({ action: 'update', id: node.id, text: getCursor(mutation.previousSibling) });
            }
            mutate.push({ action: 'add', id: node.id, isAfter: isAfter, text: node.textContent });
          })
        }

      } else if (mutation.type === 'characterData') {
        mutate.push({ action: 'update', id: mutation.target.parentNode.id, text: mutation.target.textContent });
      }
    })
    console.log(mutate);
  });
}