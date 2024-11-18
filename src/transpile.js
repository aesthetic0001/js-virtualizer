const acorn = require("acorn");
const walk = require("acorn-walk");
const eslintScope = require("eslint-scope");
const {readFileSync} = require("node:fs");
const path = require("node:path");
const {VMChunk, Opcode} = require("./utils/assembler");
const {registerNames} = require("./utils/constants");
const functionWrapperTemplate = readFileSync(path.join(__dirname, "./templates/functionWrapper.template"), "utf-8");
const crypto = require("crypto");

const debug = true
const encodings = ['base64', 'hex']

function transpilelog(message) {
    if (debug) {
        console.log(message)
    }
}

function virtualizeFunction(code) {
    const comments = [];
    const ast = acorn.parse(code, {
        ecmaVersion: "latest",
        sourceType: "module",
        locations: true,
        onComment: comments,
        ranges: true,
    });

    function needToVirtualize(node) {
        return comments.some((comment) => {
            return (
                comment.type === "Line" &&
                comment.value.trim() === "@virtualize" &&
                comment.loc.end.line === node.loc.start.line - 1
            );
        });
    }

    function analyzeScope(ast, functionNode) {
        const scopeManager = eslintScope.analyze(ast, {ecmaVersion: 2021, sourceType: "module"});
        const functionScope = scopeManager.acquire(functionNode);
        if (!functionScope) {
            throw new Error("Failed to acquire scope for function");
        }
        const dependencies = new Set();
        functionScope.through.forEach((reference) => {
            dependencies.add(reference.identifier.name);
        });
        return Array.from(dependencies)
    }

    const virtualizedChunks = [];

    walk.simple(ast, {
        FunctionDeclaration(node) {
            if (needToVirtualize(node)) {
                const dependencies = analyzeScope(ast, node);
                const reservedRegisters = new Set()

                function randomRegister() {
                    let register = crypto.randomInt(registerNames.length, 256);
                    while (reservedRegisters.has(register)) {
                        register = crypto.randomInt(registerNames.length, 256);
                    }
                    return register;
                }

                const chunk = new VMChunk();
                const encoding = encodings[crypto.randomInt(0, encodings.length)];
                const dependencyRegisters = {}
                for (const arg of node.params) {
                    const register = randomRegister();
                    reservedRegisters.add(register);
                    dependencyRegisters[register] = arg.name;
                }
                for (const dependency of dependencies) {
                    if (dependency in dependencyRegisters) {
                        transpilelog(`Warning: Dependency "${dependency}" already in dependency registers! This may lead to unexpected behavior.`);
                        continue;
                    }
                    dependencyRegisters[randomRegister()] = dependency
                }
                const outputRegister = randomRegister();
                const bytecode = chunk.toBytes().toString(encoding);
                const virtualizedFunction = functionWrapperTemplate
                    .replace("%FUNCTION_NAME%", node.id.name)
                    .replace("%ARGS%", node.params.map((param) => param.name).join(","))
                    .replace("%ENCODING%", encoding)
                    .replace("%DEPENDENCIES%", JSON.stringify(dependencyRegisters).replace(/"/g, ""))
                    .replace("%OUTPUT_REGISTER%", outputRegister.toString())
                    .replace("%BYTECODE%", bytecode);
                virtualizedChunks.push(virtualizedFunction);
                transpilelog(`Virtualized Function "${node.id.name}"`);
                transpilelog(`Dependencies: ${JSON.stringify(dependencies)}`);
                transpilelog(`${virtualizedFunction}`);
            }
        },
    });
}

const samplePath = path.join(__dirname, "../sample/sum.js");
const sampleCode = readFileSync(samplePath, "utf-8");
virtualizeFunction(sampleCode);
