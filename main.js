import { parse } from "./parser.js";

const FILE = "test.md";
// const FILE = "sample.md";
// parser & render
parse(FILE).then(async (res) => {
  let root = res;
    await Deno.writeTextFile("./sample.json", JSON.stringify(root));
});
