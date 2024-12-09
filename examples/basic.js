const path = require("node:path");
const fs = require("node:fs");

const {transpile} = require("../src/transpile");
const sampleCode = fs.readFileSync(path.join(__dirname, "expressAsync.js"), "utf-8");

async function main() {
    const result = await transpile(sampleCode, {
        fileName: "expressAsync.js",
    });

    console.log(`Virtualized code saved to: ${result.transpiledOutputPath}`);
}

main()
