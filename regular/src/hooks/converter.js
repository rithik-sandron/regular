import {
  un,
  Hline,
  Olist,
  Ulist,
  UlistTask,
  UlistTaskChecked,
  UlistTaskUnchecked,
  bold,
  boldAndItalic,
  code,
  empty,
  h1,
  h2,
  h3,
  italics,
  link,
  image,
  ltr,
  multiLineCode,
  quote,
  strike,
  table,
  tag,
  tagHash,
  tagNotify,
  accordion,
  accord,
  codeHighlight,
  tableDivider,
  image_loc,
} from "./regex";

const listTypeArray = ["disc", "circle", "square"];

function boldAndItalics(line, regReplaced, imgs) {
  regReplaced = line.replaceAll(un, `**$1**`);
  regReplaced = regReplaced.replaceAll(
    boldAndItalic,
    `<em><strong>$1</strong></em>`
  );
  regReplaced = regReplaced.replaceAll(bold, `<strong>$1</strong>`);
  regReplaced = regReplaced.replaceAll(italics, `<em>$1</em>`);
  regReplaced = regReplaced.replaceAll(strike, `<del>$1</del>`);

  regReplaced = regReplaced.replaceAll(code, `<code>$1</code>`);

  regReplaced = regReplaced.replaceAll(tagNotify, `<sup>$1</sup>`);
  regReplaced = regReplaced.replaceAll(tagHash, `<span>&#35;$1</span>`);
  regReplaced = regReplaced.replaceAll(tag, `<mark>$1</mark>`);
  if (line.match(link)) {
    regReplaced = regReplaced.replace(link, `<a href='$2'>$1</a>`);
  }
  if (line.match(image)) {
    const loc = regReplaced.match(image_loc)[0].slice(1, -1);
    regReplaced = regReplaced.replace(
      image,
      `<img src='${imgs[loc]}' alt='$2' />`
    );
  }
  return regReplaced;
}

function sanitize(line) {
  line = line.replaceAll(ltr, "&lt;");
  return line;
}

export async function convert(plain, imgs) {
  let data = plain.split("\n");
  let len = data.length;
  let dataHtml = "";
  if (data) {
    let i = 0;
    while (i < len) {
      let line = data[i];
      if (empty.test(line.trim())) {
        let regReplaced = "";
        line = sanitize(line);
        switch (true) {
          case multiLineCode.test(line):
            dataHtml += `<code><pre>`;
            i++;
            while (i < len) {
              let lineJ = data[i];
              if (lineJ.match(multiLineCode)) break;
              regReplaced = lineJ;
              if (regReplaced === "") {
                dataHtml += `<br />`;
              } else if (regReplaced.match(codeHighlight)) {
                regReplaced = regReplaced.replace(codeHighlight, "");
                dataHtml += `<p style="display: block; width: 100%; background-color: var(--color-yellow)">${regReplaced}</p>`;
              } else {
                dataHtml += `<p>${regReplaced}</p>`;
              }
              i++;
            }
            dataHtml += `</pre></code>`;
            i++;
            break;

          case h1.test(line):
            line = boldAndItalics(line, "");
            regReplaced = line.replace(h1, "");
            dataHtml += `<a style="color: inherit;" href='#${i}'><h1 id='${i}' class='table-content-h1'>${regReplaced}</h1></a>`;
            i++;
            break;

          case h2.test(line):
            line = boldAndItalics(line, "");
            regReplaced = line.replace(h2, "");
            dataHtml += `<h2 class='table-content-h2'>${regReplaced}</h2>`;
            i++;
            break;

          case h3.test(line):
            line = boldAndItalics(line, "");
            regReplaced = line.replace(h3, "");
            dataHtml += `<h3>${regReplaced}</h3>`;
            i++;
            break;

          case Hline.test(line):
            regReplaced = line.replace(Hline, "");
            dataHtml += `<hr />`;
            i++;
            break;

          case quote.test(line):
            line = boldAndItalics(line, "");
            regReplaced = line.replace(quote, "");
            dataHtml += `<blockquote>${regReplaced}</blockquote>`;
            i++;
            break;

          case table.test(line):
            dataHtml += "<table>";
            let isHeading = true;
            while (i < len) {
              let lineJ = data[i];
              lineJ = boldAndItalics(lineJ, "");

              if (!lineJ.match(table)) break;

              let cells = lineJ.substring(1, lineJ.length - 1).split("|");
              dataHtml += "<tr>";
              for (let k = 0; k < cells.length; k++) {
                cells[k] = boldAndItalics(cells[k].trim(), "");

                if (cells[k].match(Hline)) continue;

                if (isHeading) {
                  dataHtml += `<th>${cells[k].trim()}</th>`;
                } else if (cells[k].trim() === "") {
                  dataHtml += `<td class='empty-row'>${cells[k].trim()}</td>`;
                } else if (cells[k].trim().match(tableDivider)) {
                  continue;
                } else {
                  dataHtml += `<td>${cells[k].trim()}</td>`;
                }
              }
              dataHtml += "</tr>";
              isHeading = false;
              i++;
            }
            dataHtml += "</table>";
            break;

          case Olist.test(line):
            dataHtml += `<ol>`;
            let outerPadding = 1;
            while (i < len) {
              let lineJ = data[i];
              lineJ = boldAndItalics(lineJ, "");
              if (!lineJ.match(Olist)) break;
              const padding = lineJ.split(/\d+\./)[0].length / 1.6;

              if (padding !== 0 && outerPadding < padding) {
                dataHtml += `<ol>`;
                outerPadding = padding;
              }

              if (padding < outerPadding) {
                dataHtml += `</ol>`;
                outerPadding = padding;
              }

              regReplaced = lineJ.replace(Olist, "");
              dataHtml += `<li style="margin-left: ${padding}em">${regReplaced}</li>`;

              i++;
            }
            dataHtml += `</ol>`;
            break;

          case UlistTask.test(line):
            dataHtml += `<dl>`;
            while (i < len) {
              let lineJ = data[i];
              lineJ = boldAndItalics(lineJ, "");

              if (!lineJ.match(UlistTask)) break;

              regReplaced = lineJ.replace(UlistTask, "");
              const padding = lineJ.split("-")[0].length / 1.6;

              if (lineJ.match(UlistTaskChecked))
                dataHtml += `<li id='done' style='padding-left: ${padding}em'>${regReplaced}</li>`;
              else if (lineJ.match(UlistTaskUnchecked))
                dataHtml += `<li id='notdone' style='padding-left: ${padding}em'>${regReplaced}</li>`;
              i++;
            }
            dataHtml += `</dl>`;
            break;

          case Ulist.test(line):
            dataHtml += `<ul>`;

            while (i < len) {
              let lineJ = data[i];
              lineJ = boldAndItalics(lineJ, "");
              if (!lineJ.match(Ulist)) break;

              const padding = lineJ.split("-")[0].length / 1.6;
              const tabspace = lineJ.split("-")[0].length / 4;
              let listType;
              if (listType >= 2) listType = listTypeArray[2];
              else listType = listTypeArray[tabspace];
              regReplaced = lineJ.replace(Ulist, "");
              dataHtml += `<li style="margin-left: ${
                1.2 + padding
              }em; list-style-type: ${listType}">${regReplaced}</li>`;
              i++;
            }
            dataHtml += `</ul>`;
            break;

          case image.test(line):
            line = boldAndItalics(line, "", imgs);
            dataHtml += line;
            i++;
            break;

          default:
            line = boldAndItalics(line, "");
            dataHtml += `<p contenteditable>${line}</p>`;
            i++;
            break;
        }
      } else {
        dataHtml += "<br />";
        i++;
      }
    }
    return dataHtml;
  }
}