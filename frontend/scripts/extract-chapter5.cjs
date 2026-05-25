/**
 * study content/ch5/*.docx → content/chapter5/part1.txt … part4.txt
 * Run: npm run extract:chapter5 (from frontend/)
 */
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcDir = path.join(root, '..', 'study content', 'ch5');
const outDir = path.join(root, 'content', 'chapter5');

/** Reading order for Chapter 5 (Arrays). */
const SOURCES = [
  'cppCh2Part1.docx',
  'ch2 part2 p3,4,5.docx',
  'C++ll ch2 part 3    page 6,7,8.docx',
  'Worksheet2.2 .docx',
];

(async () => {
  for (let i = 0; i < SOURCES.length; i++) {
    const name = SOURCES[i];
    const src = path.join(srcDir, name);
    if (!fs.existsSync(src)) {
      console.error('Missing:', src);
      process.exit(1);
    }
    const r = await mammoth.extractRawText({ path: src });
    const text = r.value.replace(/\r\n/g, '\n').trim() + '\n';
    fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, `part${i + 1}.txt`);
    fs.writeFileSync(out, text, 'utf8');
    console.log('Wrote', out, `(${text.length} chars) from`, name);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
