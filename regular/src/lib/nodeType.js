import {
  unicode, boldRegex,
  boldRegexWithUniCode,
  dateRegex,
  dateRegexWithUnicCode
} from "./generalUtility";

export function bold(e, text, startContainer, paragraph, setCaretAtIndex, pos) {
  let match;
  if (match = boldRegexWithUniCode.exec(text)) {
    var start = match.index;
    var end = boldRegexWithUniCode.lastIndex;
    e.preventDefault();
    e.stopPropagation();
    let text = startContainer.textContent.slice(start, end);
    let b = document.createElement('span');
    b.className = "x-wrapper";
    b.innerHTML = `<span class="asterisk">${text.slice(0, 2)}</span><strong>${match[0].slice(2, -2)}</strong><span class="asterisk">${text.slice(-2)}</span>`
    let last = paragraph.insertBefore(document.createTextNode(unicode + startContainer.textContent.substring(end, startContainer.textContent.length)), startContainer);
    paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start) + unicode), last);
    paragraph.insertBefore(b, last);
    paragraph.removeChild(startContainer);
    setCaretAtIndex(paragraph, pos + 2);

  } else if (match = boldRegex.exec(text)) {
    var start = match.index;
    var end = boldRegex.lastIndex;
    e.preventDefault();
    e.stopPropagation();
    let text = startContainer.textContent.slice(start, end);
    let b = document.createElement('span');
    b.className = "x-wrapper";
    b.innerHTML = `<span class="asterisk">${text.slice(0, 2)}</span><strong>${match[0].slice(2, -2)}</strong><span class="asterisk">${text.slice(-2)}</span>`
    let last = paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(end, startContainer.textContent.length)), startContainer);
    paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start)), last);
    paragraph.insertBefore(b, last);
    paragraph.removeChild(startContainer);
    setCaretAtIndex(paragraph, pos);
  }
}

export function date(e, text, startContainer, paragraph, setCaretAtIndex, pos) {
  let match;
  if (match = dateRegexWithUnicCode.exec(text)) {
    var start = match.index;
    var end = dateRegexWithUnicCode.lastIndex;
    e.preventDefault();
    e.stopPropagation();
    let text = startContainer.textContent.slice(start, end);
    let b = document.createElement('span');
    b.className = "x-wrapper";
    b.innerHTML = `<span class="date-prefix">${text.slice(0, 2)}</span><mark>${match[0].slice(2, -1)}</mark><span class="date-prefix">${text.slice(-1)}</span>`
    let last = paragraph.insertBefore(document.createTextNode(unicode + startContainer.textContent.substring(end, startContainer.textContent.length)), startContainer);
    paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start) + unicode), last);
    paragraph.insertBefore(b, last);
    paragraph.removeChild(startContainer);
    setCaretAtIndex(paragraph, pos + 2);
  }
  else if (match = dateRegex.exec(text)) {
    var start = match.index;
    var end = dateRegex.lastIndex;
    e.preventDefault();
    e.stopPropagation();
    let text = startContainer.textContent.slice(start, end);
    let b = document.createElement('span');
    b.className = "x-wrapper";
    b.innerHTML = `<span class="date-prefix">${text.slice(0, 2)}</span><mark>${match[0].slice(2, -1)}</mark><span class="date-prefix">${text.slice(-1)}</span>`
    let last = paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(end, startContainer.textContent.length)), startContainer);
    paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start)), last);
    paragraph.insertBefore(b, last);
    paragraph.removeChild(startContainer);
    setCaretAtIndex(paragraph, pos);
  }
}

export function reCheckBold(getCaret, setCaretAtIndex) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const paragraph = startContainer.parentNode;
  const text = paragraph.textContent;
  let match = boldRegex.exec(text);
  if (match && paragraph.nodeName !== 'SPAN') {
    var start = match.index;
    var end = boldRegex.lastIndex;
    let text = paragraph.textContent.slice(start, end);
    let b = document.createElement('span');
    b.className = "x-wrapper";
    b.innerHTML = `<span class="asterisk">${text.slice(0, 2)}</span><strong>${match[0].slice(2, -2)}</strong><span class="asterisk">${text.slice(-2)}</span>`
    let last = paragraph.insertBefore(document.createTextNode(paragraph.textContent.substring(end, paragraph.textContent.length)), startContainer.parentNode);
    paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start)), last);
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

export function reCheckDate(getCaret, setCaretAtIndex) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const paragraph = startContainer.parentNode;
  const text = paragraph.textContent;
  let match = dateRegex.exec(text);
  if (match && paragraph.nodeName !== 'SPAN') {
    var start = match.index;
    var end = boldRegex.lastIndex;
    let text = paragraph.textContent.slice(start, end);
    let b = document.createElement('span');
    b.className = "x-wrapper";
    b.innerHTML = `<span class="date-prefix">${text.slice(0, 2)}</span><mark>${match[0].slice(2, -1)}</mark><span class="date-prefix">${text.slice(-1)}</span>`
    let last = paragraph.insertBefore(unicode + document.createTextNode(paragraph.textContent.substring(end, paragraph.textContent.length)), startContainer.parentNode);
    paragraph.insertBefore(document.createTextNode(startContainer.textContent.substring(0, start) + unicode), last);
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