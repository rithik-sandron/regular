import AST from "./AST.js";
import Node from "./Node.js";

const CHARS = 10_000;
const FILE = "sample.md";
const NEW_NODE = "\n";

// parser
export async function parse() {
  const info = await Deno.stat(FILE);
  const size = info.size;
  let curSize = 0;
  let root = new AST();
  const file = await Deno.open(FILE);
  let s = "";
  let global_start = 0;

  while (curSize !== size) {
    let start = await file.seek(curSize, Deno.SeekMode.Start);
    const buffer = new Uint8Array(
      info.size - curSize < CHARS ? info.size : CHARS,
    );
    const bytesRead = await file.read(buffer);
    let end = start;
    while (end < start + bytesRead) {
      if (NEW_NODE === String.fromCharCode(buffer[end - start])) {
        root.add(
          new Node(
            s,
            "li",
            false,
            global_start,
            end,
          ),
        );
        s = "";
        global_start = end++ + 1;
      } else {
        s += String.fromCharCode(buffer[end++ - start]);
      }
    }
    curSize += bytesRead;
  }

  // To add last stream of chars to a new node incase it does not have a new line char at the end
  if (s.length !== 0) {
    root.add(
      new Node(
        s,
        "",
        false,
        global_start,
        size - 1,
      ),
    );
  }
  file.close();
  let counter = 0;
  root.root.forEach((x) => {
    if (counter++ < 5) {
      console.log(x.text);
    }
  });
}
