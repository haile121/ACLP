const fs = require("fs");
const path = require("path");

const ch6JsonPath =
  "d:\\Mat\\we.b\\fyr\\study content\\ch6\\vertopal.com_Ch3 all in all  1 .json";
const outDir = "d:\\Mat\\we.b\\fyr\\frontend\\content\\chapter6";

const data = JSON.parse(fs.readFileSync(ch6JsonPath, "utf8"));

let fullText = "";
for (const [key, value] of Object.entries(data)) {
  fullText += key;
  if (value) {
    fullText += value;
  }
}

// Map "3." titles to "6."
fullText = fullText.replace("3. What is String?", "6.1 What is String?");
fullText = fullText.replace(
  "3.1 Initialization of Strings",
  "6.1.1 Initialization of Strings",
);
fullText = fullText.replace(
  "3.3 String Manipulation Functions",
  "6.1.2 String Manipulation Functions",
);

// Identify the cutoffs
const p2CutoffStr1 = "Comparing Strings (ስትሪንጎችን ማነፃፀር)";
const p2CutoffStr2 = "Comparing Strings"; // exact match if first doesn't work

let p2Index = fullText.indexOf(p2CutoffStr1);
if (p2Index === -1) p2Index = fullText.indexOf(p2CutoffStr2);

const p3CutoffStr1 = "Working with Individual Characters (በነጠላ ካራክተሮች መስራት)";
const p3CutoffStr2 = "Working with Individual Characters";

let p3Index = fullText.indexOf(p3CutoffStr1);
if (p3Index === -1) p3Index = fullText.indexOf(p3CutoffStr2);

if (p2Index === -1 || p3Index === -1) {
  console.error("Failed to find exact cutoffs. Indicies:", {
    p2Index,
    p3Index,
  });
  process.exit(1);
}

// Slice text
const part1 = fullText.substring(0, p2Index).trim();
const part2 = fullText.substring(p2Index, p3Index).trim();
const part3 = fullText.substring(p3Index).trim();

// Ensure output dir exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, "part1.txt"), part1);
fs.writeFileSync(path.join(outDir, "part2.txt"), part2);
fs.writeFileSync(path.join(outDir, "part3.txt"), part3);

console.log("Successfully wrote 3 parts to frontend/content/chapter6");
