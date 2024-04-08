export default class Node {
  // data (type string, char)
  id;
  text;
  md_text;
  skimmedText;
  type;
  charStart;
  charEnd;

  // N-ary tree (type: Node)
  level;
  indent;
  order;
  isRoot;
  firstChild;
  nextSibling;

  // dates
  pad;
  date1;
  date2;
  isUpdated;

  constructor(
    isRoot,
    level,
    indent,
    text,
    md_text,
    skimmedText,
    type,
    start,
    end,
    pad,
    date1,
    date2,
    order
  ) {
    this.id = crypto.randomUUID();
    this.isRoot = isRoot;
    this.level = level;
    this.indent = indent;
    this.text = text;
    this.md_text = md_text;
    this.skimmedText = skimmedText;
    this.type = type;
    this.charStart = start;
    this.charEnd = end;
    this.pad = pad;
    this.date1 = date1;
    this.date2 = date2;
    this.order = order;
    this.isUpdated = false;
    // children
    this.firstChild = null;
    this.nextSibling = null;
  }

  sibling(n) {
    if (n instanceof Node) {
      this.nextSibling = n;
      return true;
    }
    return false;
  }

  child(n) {
    if (n instanceof Node) {
      this.firstChild = n;
      return true;
    }
    return false;
  }
}
