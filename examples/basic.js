const path = require("node:path");
const {virtualizeFunctions} = require("../src/transpile");
const fs = require("node:fs");
const targetFile = "functionWithDefault.js";
const samplePath = path.join(__dirname, "../sample/");
const sampleCode = fs.readFileSync(path.join(samplePath, targetFile), "utf-8");
const final = virtualizeFunctions(sampleCode);
fs.writeFileSync(path.join(samplePath, targetFile.replace(".js", ".virtualized.js")), final, "utf-8");
