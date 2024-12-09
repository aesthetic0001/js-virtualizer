const path = require("node:path");
const fs = require("node:fs");

const {transpile} = require("../src/transpile");
const samplePath = path.join(__dirname, "../sample/");
const child_process = require("node:child_process");
const assert = require("node:assert");

async function main() {
    for (const file of fs.readdirSync(samplePath)) {
        const sampleCode = fs.readFileSync(path.join(samplePath, file), "utf-8");
        const result = await transpile(sampleCode, {
            fileName: file,
            passes: ["RemoveUnused"]
        });

        const originalOutput = child_process.execSync(`node ${path.join(samplePath, file)}`).toString()
        const transpiledOutput = child_process.execSync(`node ${result.transpiledOutputPath}`).toString()
        assert(originalOutput === transpiledOutput)
    }
}

main()
