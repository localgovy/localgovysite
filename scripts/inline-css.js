'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const css = [
  fs.readFileSync(path.join(root, 'assets/fonts.css'), 'utf8').trim(),
  fs.readFileSync(path.join(root, 'assets/site.css'), 'utf8').trim(),
].join('\n');

if (/<\/style/i.test(css)) {
  throw new Error('Refusing to inline CSS that contains </style');
}

const START = '<!--lg-css-->';
const END = '<!--/lg-css-->';
const block = `${START}\n  <style>${css}</style>\n  ${END}`;
const markedRe = /<!--lg-css-->[\s\S]*?<!--\/lg-css-->/;
const linkRe =
  /[ \t]*<link rel="stylesheet" href="\/assets\/fonts\.css" \/>\s*<link rel="stylesheet" href="\/assets\/site\.css" \/>/;

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
}

const files = [];
walk(root, files);

let updated = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  let next = html;
  if (markedRe.test(html)) next = html.replace(markedRe, block);
  else if (linkRe.test(html)) next = html.replace(linkRe, `  ${block}`);
  else continue;
  if (next !== html) {
    fs.writeFileSync(file, next);
    updated += 1;
    console.log('inlined CSS in', path.relative(root, file));
  }
}

console.log(`updated ${updated} page(s)`);
