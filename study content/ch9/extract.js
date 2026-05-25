const fs = require("fs");

const path =
  "d:\\Mat\\we.b\\fyr\\study content\\ch9\\vertopal.com_Ch 6  under.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

let fullText = "";
for (const [key, value] of Object.entries(data)) {
  fullText += key;
  if (value) {
    fullText += value;
  }
}

// Write to raw.txt so we can see it
fs.writeFileSync("d:\\Mat\\we.b\\fyr\\study content\\ch9\\raw.txt", fullText);
console.log("Done writing raw.txt. Length:", fullText.length);
