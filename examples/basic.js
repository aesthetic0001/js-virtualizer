const path = require("node:path");
const fs = require("node:fs");

const {transpile} = require("../src/transpile");
const targetSample = "sum";
const samplePath = path.join(__dirname, "../sample/");
const sampleCode = fs.readFileSync(path.join(samplePath, targetSample + '.js'), "utf-8");

async function main() {
    const result = await transpile(sampleCode, {
        fileName: targetSample
    });

    console.log(`Virtualized code saved to: ${result.transpiledOutputPath}`);
}

main()
