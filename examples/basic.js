const path = require("node:path");
const {virtualizeFunctions} = require("../src/transpile");
const fs = require("node:fs");

const samplePath = path.join(__dirname, "../sample/expressionhell.js");
const sampleCode = fs.readFileSync(samplePath, "utf-8");
const final = virtualizeFunctions(sampleCode);
fs.writeFileSync(path.join(__dirname, "../sample/expressionhell.virtualized.js"), final, "utf-8");
