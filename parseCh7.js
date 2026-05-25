const fs = require("fs");
const path = require("path");

const jsonPath = path.join(
  __dirname,
  "./study content/ch7/vertopal.com_Chapter Four-WPS Office.json",
);
const outDir = path.join(__dirname, "./frontend/content/chapter7");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
let fullText = "";

for (const key in data) {
  fullText += key;
  if (data[key]) {
    fullText += data[key];
  }
}

// Split into parts.
// We can find headers like "4.1.", "4.2." etc. or just split by length.
// Actually, let's look for "4.x." as section headers.
const sections = fullText.split(/(?=4\.\d+\.\s+)/g);

// Part 1: Intro (before 4.1)
// Part 2: 4.1 - 4.3 (Declaring Pointers, Assigning values to pointers, Pointer to void)
// Part 3: 4.4 - 4.6 (Arrays of Pointers, Pointer and arrays, Pointer Advantage)
// Part 4: 4.7 - 4.8 (Pointer Arithmetic, Pointer and String)
// Part 5: 4.9 - 4.10 (Pointer to pointer, Dynamic memory)

let parts = ["", "", "", "", ""];

for (const section of sections) {
  if (
    section.startsWith("4.1.") ||
    section.startsWith("4.2.") ||
    section.startsWith("4.3.")
  ) {
    parts[1] += section + "\n";
  } else if (
    section.startsWith("4.4.") ||
    section.startsWith("4.5.") ||
    section.startsWith("4.6.")
  ) {
    parts[2] += section + "\n";
  } else if (section.startsWith("4.7.") || section.startsWith("4.8.")) {
    parts[3] += section + "\n";
  } else if (section.startsWith("4.9.") || section.startsWith("4.10.")) {
    parts[4] += section + "\n";
  } else {
    // Includes intro or code samples at the end that don't start with 4.x.
    if (parts[4].length > 0) {
      // Append to the last seen part if we already passed 4.10
      parts[4] += section + "\n";
    } else {
      parts[0] += section + "\n";
    }
  }
}

// Check what happens if any part is empty
parts = parts.filter((p) => p.trim() !== "");

parts.forEach((content, i) => {
  fs.writeFileSync(path.join(outDir, `part${i + 1}.txt`), content.trim());
});

console.log("Successfully wrote " + parts.length + " parts.");
