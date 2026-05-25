const fs = require("fs");
const path = require("path");

const rawPath = "d:\\Mat\\we.b\\fyr\\study content\\ch9\\raw.txt";
const outDir = "d:\\Mat\\we.b\\fyr\\frontend\\content\\chapter9";

let text = fs.readFileSync(rawPath, "utf8");

// Replace "Chapter Six" to "Chapter Nine"
text = text.replace(/Chapter Six/g, "Chapter Nine");
text = text.replace(/ምዕራፍ ስድስት/g, "ምዕራፍ ዘጠኝ");

// Replace 6.x to 9.x
text = text.replace(/6\./g, "9.");

// We want to split it by headers. We look for specific headers.
// Part 1: Start until "9.3: Operation With File"
// Part 2: 9.3 until "9.4.1.2: Writing to a sequential File"
// Part 3: 9.4.1.2 until "9.4.1.3: Reading from a File"
// Part 4: 9.4.1.3 to EOF

const p2Index = text.indexOf("9.3: Operation With File");
const p3Index = text.indexOf("9.4.1.2: Writing to a sequential File");
const p4Index = text.indexOf("9.4.1.3: Reading from a File");

if (p2Index === -1 || p3Index === -1 || p4Index === -1) {
  console.error("Could not find all split indices:", {
    p2Index,
    p3Index,
    p4Index,
  });
  process.exit(1);
}

const part1 = text.substring(0, p2Index).trim();
const part2 = text.substring(p2Index, p3Index).trim();
const part3 = text.substring(p3Index, p4Index).trim();
const part4 = text.substring(p4Index).trim();

// Ensure output dir exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, "part1.txt"), part1);
fs.writeFileSync(path.join(outDir, "part2.txt"), part2);
fs.writeFileSync(path.join(outDir, "part3.txt"), part3);
fs.writeFileSync(path.join(outDir, "part4.txt"), part4);

console.log("Successfully wrote 4 parts to frontend/content/chapter9");
