const acorn = require("acorn");
const walk = require("acorn-walk");
const eslintScope = require("eslint-scope");
const {readFileSync, writeFileSync} = require("node:fs");
const path = require("node:path");
const functionWrapperTemplate = readFileSync(path.join(__dirname, "./templates/functionWrapper.template"), "utf-8");
const requireTemplate = readFileSync(path.join(__dirname, "./templates/requireTemplate.template"), "utf-8");
const crypto = require("crypto");
const {FunctionBytecodeGenerator} = require("./utils/BytecodeGenerator");
const escodegen = require("escodegen");
const {log, LogData} = require("./utils/log");
const zlib = require("node:zlib");
const runPasses = require("./utils/runPasses");
const fs = require("node:fs");

const vmDist = fs.readFileSync(path.join(__dirname, './vm_dist.js'), 'utf-8');
const encodings = ['base64']

if (!fs.existsSync(path.join(__dirname, '../output'))) fs.mkdirSync(path.join(__dirname, '../output'))

function virtualizeFunctions(code) {
    const correspondingVM = path.join(__dirname, `../output/${crypto.randomBytes(8).toString('hex')}.vm.js`);
    const comments = [];
    const ast = acorn.parse(code, {
        ecmaVersion: "latest",
        sourceType: "module",
        locations: true,
        onComment: comments,
        ranges: true,
    });

    const vmAST = acorn.parse(vmDist, {
        ecmaVersion: "latest",
        sourceType: "module",
        locations: true,
        ranges: true,
    })

    const requireInject = requireTemplate.replace("%VM_PATH%", correspondingVM)

    ast.body.unshift(acorn.parse(requireInject, {
        ecmaVersion: "latest",
        sourceType: "module",
        locations: true,
        ranges: true,
    }).body[0])

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

    const chunks = []

    function virtualizeFunction(node) {
        log(new LogData(`Virtualizing Function "${node.id.name}"`, 'info', false));
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

        const params = []

        for (const arg of node.params) {
            const register = generator.randomRegister()
            switch (arg.type) {
                case "AssignmentPattern":
                    // unnecessary because we only replace the function body
                    // log(new LogData(`Resolving nullish parameter ${arg.left.name} = ${arg.right.value}`, 'info', false));
                    generator.declareVariable(arg.left.name, register)
                    // generator.resolveExpression(arg)
                    regToDep[register] = arg.left.name
                    params.push(arg.left.name)
                    break
                case "Identifier":
                    // log(new LogData(`Resolving parameter ${arg.name}`, 'info', false));
                    generator.declareVariable(arg.name, register)
                    regToDep[register] = arg.name
                    params.push(arg.name)
                    break
                case "RestElement":
                    // log(new LogData(`Resolving rest parameter ${arg.argument.name}`, 'info', false));
                    generator.declareVariable(arg.argument.name, register)
                    regToDep[register] = arg.argument.name
                    params.push(arg.argument.name)
                    break
                default: {
                    throw new Error(`Unsupported argument type: ${arg.type}`)
                }
            }
        }

        generator.generate();
        chunks.push(generator.chunk)

        const bytecode = zlib.deflateSync(Buffer.from(generator.getBytecode())).toString(encoding);
        const virtualizedFunction = functionWrapperTemplate
            .replace("%FN_PREFIX%", node.async ? "async " : "")
            .replace("%FUNCTION_NAME%", node.id.name)
            .replace("%ARGS%", params.join(","))
            .replace("%ENCODING%", encoding)
            .replace("%DEPENDENCIES%", JSON.stringify(regToDep).replace(/"/g, ""))
            .replace("%OUTPUT_REGISTER%", generator.outputRegister.toString())
            .replace("%BYTECODE%", bytecode)
            .replace("%RUNCMD%", node.async ? "await VM.runAsync()" : "VM.run()");

        const dependentTemploads = []
        Object.keys(generator.available).forEach((k) => {
            if (!generator.available[k]) {
                dependentTemploads.push(k)
            }
        })
        if (dependentTemploads.length > 0) {
            log(new LogData(`Warning: Non-freed tempload(s) detected: ${dependentTemploads.join(", ")}`, 'warn', false));
        }
        log(new LogData(`Successfully Virtualized Function "${node.id.name}"`, 'success', false));
        log(`Dependencies: ${JSON.stringify(dependencies)}`);
        const replacedBody = acorn.parse(virtualizedFunction, {
            ecmaVersion: "latest",
            sourceType: "module",
            locations: true,
            ranges: true,
        });

        return replacedBody.body[0].body.body
    }

    walk.simple(ast, {
        FunctionDeclaration(node) {
            if (needToVirtualize(node)) {
                node.body.body = virtualizeFunction(node);
            }
        },
    });

    runPasses(chunks, vmAST);
    const accompanyingVM = escodegen.generate(vmAST);
    fs.writeFileSync(correspondingVM, accompanyingVM);
    return escodegen.generate(ast);
}

module.exports = {
    virtualizeFunctions
}
