const path = require("node:path");
const fs = require("node:fs");

const {transpile} = require("../src/transpile");
const samplePath = path.join(__dirname, "../sample/");
const child_process = require("node:child_process");
const assert = require("node:assert");
const skip = new Set(["trycatch.js"])

async function main() {
    for (const file of fs.readdirSync(samplePath)) {
        if (skip.has(file)) {
            console.log(`Skipping ${file}`)
            continue
        }
        console.log(`Testing ${file}`)
        const sampleCode = fs.readFileSync(path.join(samplePath, file), "utf-8");
        const result = await transpile(sampleCode, {
            fileName: file,
            passes: ["RemoveUnused"]
        });

        const originalOutput = child_process.execSync(`node ${path.join(samplePath, file)}`).toString()
        const transpiledOutput = child_process.execSync(`node ${result.transpiledOutputPath}`).toString()
        console.log(`--- Original Output Begin ---`)
        console.log(originalOutput)
        console.log(`--- Original Output End ---`)
        console.log()
        console.log(`--- Transpiled Output Begin ---`)
        console.log(transpiledOutput)
        console.log(`--- Transpiled Output End ---`)
        assert(originalOutput === transpiledOutput, `Transpiler failed for ${file}!`)
    }
    console.log("All tests passed")
}

main()
