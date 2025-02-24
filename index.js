const fs = require("fs");

function catching(fn, errorMessage, filename) {
  try {
    return fn();
  } catch (e) {
    console.error(`${errorMessage} ${filename}:`, e.message);
    process.exit(1);
  }
}

function readLines(filename) {
  return catching(() => 
    new Set(
      fs.readFileSync(filename, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
    ),
    "Ошибка при чтении файла",
    filename
  );
}

function writeLines(filename, lines) {
  catching(() => 
    fs.writeFileSync(filename, [...lines].join("\n") + "\n", "utf8"), 
    "Ошибка при записи файла",
    filename
  );
}

function getDifference(setA, setB) {
    return [...setA].filter(line => !setB.has(line));
  }

function findDifferences(file1, file2, output1, output2) {
  const set1 = readLines(file1);
  const set2 = readLines(file2);

  writeLines(output1, getDifference(set1, set2));
  writeLines(output2, getDifference(set2, set1));
}

const [file1, file2, output1, output2] = process.argv.slice(2);

if (!file1 || !file2 || !output1 || !output2) {
  console.error("Something is missing");
  process.exit(1);
}

findDifferences(file1, file2, output1, output2);