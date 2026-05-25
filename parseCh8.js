const fs = require("fs");
const path = require("path");

const jsonPath = path.join(
  __dirname,
  "./study content/ch8/vertopal.com_Chapter Five-WPS Office.json",
);
const outDir = path.join(__dirname, "./frontend/content/chapter8");

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

// Split into parts based on "5.x" headers
const sections = fullText.split(/(?=5\.\d+\s+)/g);

let parts = ["", "", "", ""];

for (const section of sections) {
  if (section.startsWith("5.2") || section.startsWith("5.3")) {
    parts[1] += section + "\n";
  } else if (section.startsWith("5.4") || section.startsWith("5.5")) {
    parts[2] += section + "\n";
  } else if (
    section.startsWith("5.6") ||
    section.startsWith("5.7") ||
    section.startsWith("5.8") ||
    section.startsWith("5.9")
  ) {
    parts[3] += section + "\n";
  } else {
    // Includes 5.1 and intro
    parts[0] += section + "\n";
  }
}

// Check what happens if any part is empty
parts = parts.filter((p) => p.trim() !== "");

parts.forEach((content, i) => {
  fs.writeFileSync(path.join(outDir, `part${i + 1}.txt`), content.trim());
});

console.log("Successfully wrote " + parts.length + " parts.");
