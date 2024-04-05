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
  isRoot;
  firstChild;
  nextSibling;
  childrenMap;

  // for root node
  constructor(
    isRoot,
    level,
    indent,
    text,
    md_text,
    skimmedText,
    type,
    start,
    end
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

    // children
    this.firstChild = null;
    this.nextSibling = null;
    this.childrenMap = new Map();
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
