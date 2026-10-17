const fs = require("fs");
const path = require("path");

const DIRS = [
  "d:\\Mat\\we.b\\fyr\\frontend",
  "d:\\Mat\\we.b\\fyr\\backend",
  "d:\\Mat\\we.b\\fyr\\README.md",
];

const EXTS = [".ts", ".tsx", ".json", ".txt", ".md", ".sql"];
const IGNORE_DIRS = ["node_modules", ".next", ".git"];

function scanAndReplace(dir) {
  if (fs.statSync(dir).isFile()) {
    replaceInFile(dir);
    return;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (IGNORE_DIRS.includes(file)) continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndReplace(fullPath);
    } else {
      const ext = path.extname(fullPath);
      if (EXTS.includes(ext) || file.startsWith(".env")) {
        replaceInFile(fullPath);
      }
    }
  }
}

function replaceInFile(filePath) {
  try {
    const original = fs.readFileSync(filePath, "utf8");
    // Using simple literal replacement to avoid breaking regex rules unintentionally.
    if (original.includes("ACLP")) {
      const replaced = original
        .replace(/ACLP/g, "Afro DevHub")
        .replace(/Amharic C\+\+ Learning Platform/gi, "Afro DevHub Platform");
      fs.writeFileSync(filePath, replaced, "utf8");
      console.log(`Updated: ${filePath}`);
    }
  } catch (e) {
    // Ignore binary files or read errors
  }
}

DIRS.forEach((d) => {
  if (fs.existsSync(d)) {
    scanAndReplace(d);
  }
});
