import fs from "fs";
import path from "path";

// Directory containing the JavaScript files
const directoryPath = "./src"; // Update this path as needed

// Regular expressions to match console.log statements and TODO comments
const consoleLogRegex = /console\.log\(.*?\);?/g;
const todoRegex = /\/\/\s*TODO.*$/gm;

// Function to remove console.log and TODO comments from a file
function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Remove console.log statements
    content = content.replace(consoleLogRegex, "");

    // Remove TODO comments
    content = content.replace(todoRegex, "");

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Cleaned: ${filePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// Function to recursively process all .js files in the directory
function processDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);

    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath); // Recursively process subdirectories
    } else if (file.endsWith(".js")) {
      cleanFile(fullPath); // Clean JavaScript files
    }
  });
}

// Start processing from the specified directory
processDirectory(directoryPath);

console.log("All console.log statements and TODO comments removed.");
