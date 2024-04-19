import Node from "./Node.js";
import { render } from "./renderer.js";

const CHARS = 10_000;
const NEW_LINE = "\n";
const TAB = "\t";
const TYPE = "p";
const EMPTY_TYPE = "br";

// parser
export async function parse(FILE) {
  const info = await Deno.stat(FILE);
  const size = info.size;
  let curSize = 0;
  let level = 0;
  let prev = null;
  let parents = [];
  let root = null;
  let order = 1;
  const file = await Deno.open(FILE);
  let s = "";
  let global_start = 0;

  while (curSize !== size) {
    let start = await file.seek(curSize, Deno.SeekMode.Start);
    const buffer = new Uint8Array(
      info.size - curSize < CHARS ? info.size : CHARS
    );
    const bytesRead = await file.read(buffer);
    let end = start;
    while (end < start + bytesRead) {
      if (NEW_LINE === String.fromCharCode(buffer[end - start])) {
        // is root
        const [md_text, skimmedText, pad, date1, date2] = render(s);
        if (prev === null) {
          root = new Node(
            true,
            0,
            0,
            s,
            md_text,
            skimmedText,
            "h1",
            global_start,
            end,
            pad,
            date1,
            date2,
            date1 !== null ? 3 * order++ : 0
          );
          parents.push(root);
          prev = root;
        } else if (level === prev.level) {
          let n = new Node(
            false,
            level,
            level * 1.4,
            s,
            md_text,
            skimmedText,
            s === "" ? EMPTY_TYPE : TYPE,
            global_start,
            end,
            pad,
            date1,
            date2,
            date1 !== null ? 3 * order++ : 0
          );
          if (prev.isRoot) {
            // parents.push(prev);
            prev.child(n);
          } else {
            prev.sibling(n);
          }

          prev = n;
        } else if (level < prev.level) {
          let i = parents.length - 1;
          while (level !== prev.level && i > 0) {
            prev = parents[i--];
          }
          let n = new Node(
            false,
            level,
            level * 1.4,
            s,
            md_text,
            skimmedText,
            s === "" ? EMPTY_TYPE : TYPE,
            global_start,
            end,
            pad,
            date1,
            date2,
            date1 !== null ? 3 * order++ : 0
          );
          prev.sibling(n);
          prev = n;
        } else if (level > prev.level) {
          let n = new Node(
            false,
            level,
            level * 1.4,
            s,
            md_text,
            skimmedText,
            s === "" ? EMPTY_TYPE : TYPE,
            global_start,
            end,
            pad,
            date1,
            date2,
            date1 !== null ? 3 * order++ : 0
          );
          parents.push(prev);
          prev.child(n);
          prev = n;
        }
        s = "";
        global_start = end++ + 1;
        level = 0;
      } else {
        if (TAB === String.fromCharCode(buffer[end - start])) {
          level++;
        } else {
          s += String.fromCharCode(buffer[end - start]);
        }
        end++;
      }
    }
    curSize += bytesRead;
  }

  // To add last stream of chars to a new node incase it does not have a new line char at the end
  // if (s.length !== 0) {

  // }
  file.close();
  parents = null;
  root.order = order;
  return root;
}

// node search
function getNode(node) {
  if (node.isUpdated) {
    const [md_text, skimmedText, pad, date1, date2] = render(node.text);
    node.md_text = md_text;
    node.skimmedText = skimmedText;
    node.pad = pad;
    node.date1 = date1;
    node.date2 = date2;
    node.isUpdated = false;
    return true;
  }
  if (node.firstChild !== null) return getNode(node.firstChild);
  if (node.nextSibling !== null) return getNode(node.nextSibling);
}

export async function parse_Root(root) {
  if (getNode(root)) {
    return root;
  }
  return root;
}
