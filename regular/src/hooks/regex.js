// regex patterns

// for headers
export const h1 = { type: "h1", r: /^\s*# /gim };
export const h2 = { type: "h2", r: /^\s*## /gim };
export const h3 = { type: "h3", r: /^\s*### /gim };
export const Ulist = { type: "li", r: /^\s*-\s+/gim };
export const Hline = { type: "hr", r: /---+/ };

export const emptySpace = /\\s+/g;

// for quote
export const quote = /^\s*> /gim;

// list
export const Olist = /^\s*\d+\./;
export const UlistTask = /^\s*-\[[xX ]\] /gim;
export const UlistTaskChecked = /^\s*-\[[xX]\] /gim;
export const UlistTaskUnchecked = /^\s*-\[[ ]\] /gim;

// code
export const multiLineCode = /^```/g;
export const codeHighlight = /^\* /g;
export const code = /`(.+?)`(?!\*)/gi;

// empty line
export const empty = /\S/;

// for bold, italics and strike through
export const bold = /\*\*(.+?)\*\*(?!\*)/g;
export const tag = /==(\S(.*?\S)?)==/gi;
export const tagNotify = /==\*(\S(.*?\S)?)==/gi;
export const tagHash = /==#(\S(.*?\S)?)==/gi;
export const colorTags = /=\[(.*?)\]\((.*?)\)=/gim;

export const italics = /\*(.+?)\*(?!\*)/g;
export const strike = /\~\~(.+?)\~\~(?!\*)/g;
export const boldAndItalic = /\*\*\*(.+?)\*\*\*(?!\*)/g;
export const un = /\*\*\*\*(.+?)\*\*\*\*(?!\*)/g;
export const link = /\[\[(.*?)\]\]\(((https:|http:)\/\/.*?)\)/g;
export const image = /\!\[(.*?)\]\((.*?)\)/g;
export const image_loc = /\((.*?)\)/g;

// for sanitization
export const ltr = /</gi;
//   export const gtr = />/gi;

// Table
export const table = /^\|(.*?)\|+/gim;
export const tableDivider = /\:[-]+/g;

//accordions
export const accordion = /^\s*>[aA]/gim;
export const accord = /\+\+/gim;

export const regex = [h1, h2, h3, Ulist, Hline];
