import { parse } from "./parser.js";
Deno.bench("Async method", async () => {
    parse()
  });