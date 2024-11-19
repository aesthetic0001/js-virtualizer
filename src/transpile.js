const acorn = require("acorn");
const walk = require("acorn-walk");
const eslintScope = require("eslint-scope");
const {readFileSync} = require("node:fs");
const path = require("node:path");
const functionWrapperTemplate = readFileSync(path.join(__dirname, "./templates/functionWrapper.template"), "utf-8");
const crypto = require("crypto");
const {FunctionBytecodeGenerator} = require("./utils/BytecodeGenerator");

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

    function virtualizeFunction(node) {
        const dependencies = analyzeScope(ast, node);
        const functionBody = node.body.body;
        const encoding = encodings[crypto.randomInt(0, encodings.length)];
        const regToDep = {}

        const generator = new FunctionBytecodeGenerator(functionBody);

        for (const dependency of dependencies) {
            const register = generator.randomRegister()
            regToDep[register] = dependency
            generator.declareVariable(dependency, register)
        }

        for (const arg of node.params) {
            if (regToDep[arg.name]) {
                transpilelog(`Warning: Param "${arg.name}" shadows dependency "${regToDep[arg]}"!`);
            }
            const register = generator.randomRegister();
            regToDep[register] = arg.name;
            generator.declareVariable(arg.name, register)
        }

        console.log(generator)

        generator.generate();

        const bytecode = generator.getBytecode().toString(encoding);
        const virtualizedFunction = functionWrapperTemplate
            .replace("%FUNCTION_NAME%", node.id.name)
            .replace("%ARGS%", node.params.map((param) => param.name).join(","))
            .replace("%ENCODING%", encoding)
            .replace("%DEPENDENCIES%", JSON.stringify(regToDep).replace(/"/g, ""))
            .replace("%OUTPUT_REGISTER%", generator.outputRegister.toString())
            .replace("%BYTECODE%", bytecode);
        virtualizedChunks.push(virtualizedFunction);
        transpilelog(`Virtualized Function "${node.id.name}"`);
        transpilelog(`Dependencies: ${JSON.stringify(dependencies)}`);
        transpilelog(`${virtualizedFunction}`);
    }

    walk.simple(ast, {
        FunctionDeclaration(node) {
            if (needToVirtualize(node)) {
                virtualizeFunction(node);
            }
        },
    });

    return virtualizedChunks;
}

const samplePath = path.join(__dirname, "../sample/sum.js");
const sampleCode = readFileSync(samplePath, "utf-8");
virtualizeFunction(sampleCode);
