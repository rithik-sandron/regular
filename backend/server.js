import { parse, parse_Root } from "./parser.js";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const router = new Router();
router
  .get("/", async (context) => {
    const FILE = "test.md";
    // const FILE = "sample.md";
    // parse(FILE).then(async (root) => {
    //   await Deno.writeTextFile("./sample.json", JSON.stringify(root));
    // });
    const file = await Deno.open("./sample.json");
    context.response.body = file.readable;
  })
  .post("/u", async (context) => {
    let root = await context.request.body("json").value;
    root = await parse_Root(root);
    const res = await Deno.writeTextFile("./sample.json", JSON.stringify(root));
    context.response.body = res;
  });
const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
