export function newMarkdown(blocks = []) {
  let blocksDOM = [];
  blocks.forEach((b) => blocksDOM.push({ id: b.id, e: createBlock(b) }));
  return blocksDOM;
}
