const {VMChunk, Opcode, encodeDWORD, BytecodeValue} = require("./assembler");
const crypto = require("crypto");
const {registerNames, binaryOperatorToOpcode, needsCleanup} = require("./constants");
const {log, LogData} = require("./log");
const resolveBinaryExpression = require("../transformations/BinaryExpression");
const resolveMemberExpression = require("../transformations/MemberExpression");
const resolveCallExpression = require("../transformations/CallExpression");
const resolveObjectExpression = require("../transformations/ObjectExpression");
const resolveArrayExpression = require("../transformations/ArrayExpression");
const resolveNewExpression = require("../transformations/NewExpression");
const resolveExpression = require("../transformations/resolveToRegister");
const resolveIfStatement = require("../transformations/IfStatement");
const resolveUnaryExpression = require("../transformations/UnaryExpression");
const resolveUpdateExpression = require("../transformations/UpdateExpression");
const resolveForStatement = require("../transformations/ForStatement");
const resolveWhileStatement = require("../transformations/WhileStatement");
const resolveForOfStatement = require("../transformations/ForOfStatement");
const resolveForInStatement = require("../transformations/ForInStatement");
const resolveFunctionDeclaration = require("../transformations/FunctionDeclaration");
const resolveLogicalExpression = require("../transformations/LogicalExpression");
const resolveConditionalExpression = require("../transformations/ConditionalExpression");
const resolveTemplateLiteral = require("../transformations/TemplateLiteral");
const resolveSpreadElement = require("../transformations/SpreadElement");
const resolveAssignmentPattern = require("../transformations/AssignmentPattern");
const assert = require("node:assert");
const resolveAwaitExpression = require("../transformations/AwaitExpression");
const resolveTryStatement = require("../transformations/TryStatement");
const resolveThrowStatement = require("../transformations/ThrowStatement");
const resolveSequenceExpression = require("../transformations/SequenceExpression");
const resolveAssignmentExpression = require("../transformations/AssignmentExpression");

const TL_COUNT = 30

class FunctionBytecodeGenerator {
    constructor(ast, chunk) {
        this.ast = ast;
        this.chunk = chunk || new VMChunk();
        this.reservedRegisters = new Set()
        this.outputRegister = this.randomRegister();

        // for arithmetics and loading values
        // binary expressions and member expressions need 4 TL each
        // call expressions need 6 (too lazy to calculate actual value, this is just a guess)
        this.available = {}
        this.TLMap = {}
        for (let i = 1; i <= TL_COUNT; i++) {
            const regName = `TL${i}`
            this[regName] = this.randomRegister();
            this.TLMap[this[regName]] = regName
            this.available[regName] = true
        }
        log(new LogData(`Output register: ${this.outputRegister}`, 'accent', false))

        // for variable contexts
        // variables declared by the scope, array of array of variable names
        // 0th element is the global scope, subsequent elements are nested scopes
        this.activeScopes = [[]]
        // variables that are currently in the active scope, map of variable name to array of registers,
        // where the last element is the most recent register (active reference)
        this.activeVariables = {}
        this.takenLabels = new Set()
        // labels that need to be resolved
        this.processStack = []
        // a bunch of stacks which contain the current relevant label for each context
        this.contextLabels = {
            loops: [],
            vfunc: []
        }
        // like activeVariables but for functions
        // contains important information such as the IP of the function, register map for the arguments, dependencies, etc.
        this.activeVFunctions = {}
        // for variables that are out of current scope but still accessible
        // ie. by functions
        this.dropDefers = {}
        this.vfuncReferences = []

        this.resolveExpression = resolveExpression.bind(this)
        this.resolveBinaryExpression = resolveBinaryExpression.bind(this)
        this.resolveLogicalExpression = resolveLogicalExpression.bind(this)
        this.resolveMemberExpression = resolveMemberExpression.bind(this)
        this.resolveCallExpression = resolveCallExpression.bind(this)
        this.resolveObjectExpression = resolveObjectExpression.bind(this)
        this.resolveArrayExpression = resolveArrayExpression.bind(this)
        this.resolveNewExpression = resolveNewExpression.bind(this)
        this.resolveUnaryExpression = resolveUnaryExpression.bind(this)
        this.resolveUpdateExpression = resolveUpdateExpression.bind(this)
        this.resolveConditionalExpression = resolveConditionalExpression.bind(this)
        this.resolveTemplateLiteral = resolveTemplateLiteral.bind(this)
        this.resolveSpreadElement = resolveSpreadElement.bind(this)
        this.resolveAssignmentPattern = resolveAssignmentPattern.bind(this)
        this.resolveAwaitExpression = resolveAwaitExpression.bind(this)
        this.resolveThrowStatement = resolveThrowStatement.bind(this)
        this.resolveSequenceExpression = resolveSequenceExpression.bind(this)
        this.resolveAssignmentExpression = resolveAssignmentExpression.bind(this)

        this.resolveIfStatement = resolveIfStatement.bind(this)
        this.resolveForStatement = resolveForStatement.bind(this)
        this.resolveForOfStatement = resolveForOfStatement.bind(this)
        this.resolveForInStatement = resolveForInStatement.bind(this)
        this.resolveWhileStatement = resolveWhileStatement.bind(this)
        this.resolveFunctionDeclaration = resolveFunctionDeclaration.bind(this)
        this.resolveTryStatement = resolveTryStatement.bind(this)
    }

    dropVariable(variableName) {
        if (!this.activeVariables[variableName]) {
            log(new LogData(`Attempted to drop variable ${variableName} which is not in scope! Skipping`, 'warn', false))
            return
        }
        const {register} = this.activeVariables[variableName].pop()
        this.removeRegister(register)
    }

    declareVariable(variableName, register) {
        log(new LogData(`Declaring variable ${variableName} at register ${register ?? 'random'}`, 'accent'))
        if (!this.activeVariables[variableName]) {
            this.activeVariables[variableName] = []
        }
        this.activeScopes[this.activeScopes.length - 1].push(variableName)
        this.activeVariables[variableName].push({
            register: register ?? this.randomRegister(),
            metadata: {
                vfuncContext: this.getActiveLabel('vfunc') ?? 'outside_of_vfunc'
            }
        })
    }

    getVariable(variableName) {
        log(`Getting variable ${variableName}`)
        const scopeArray = this.activeVariables[variableName]
        if (!scopeArray) {
            log(new LogData(`Variable ${variableName} not found in scope!`, 'error', false))
            throw new Error(`Variable ${variableName} not found in scope!`)
        }
        const {register, metadata} = scopeArray[scopeArray.length - 1]
        if (this.getActiveLabel('vfunc')) {
            const accessContext = this.getActiveLabel('vfunc')
            if (metadata.vfuncContext !== accessContext) {
                log(new LogData(`VFunc capturing variable ${variableName} by reference! Current Context: ${accessContext}, Variable Context: ${metadata.vfuncContext}`, 'warn', false))
                this.vfuncReferences[this.vfuncReferences.length - 1].add(register)
            }
        }
        return register
    }

    removeRegister(register) {
        if (this.dropDefers[register] && this.dropDefers[register] > 0) {
            log(new LogData(`Prohibiting dropping of required register ${register}`, 'warn'))
            return
        }
        this.reservedRegisters.delete(register);
    }

    deferDrop(register) {
        if (!this.dropDefers[register]) this.dropDefers[register] = 0
        this.dropDefers[register] += 1
    }

    releaseDefer(register) {
        if (!this.dropDefers[register]) {
            log(new LogData(`Attempted to release defer on register ${register} which is not deferred! Skipping`, 'warn', false))
            return
        }
        this.dropDefers[register] -= 1
        if (this.dropDefers[register] === 0) {
            log(new LogData(`Register ${register} has no more dependencies and can be dropped`, 'accent', false))
            this.removeRegister(register)
        }
    }

    registerVFunction(name, metadata) {
        const register = this.getVariable(name)
        if (this.activeVFunctions[register]) {
            log(new LogData(`Function ${name} already registered at register ${register}! Overwriting`, 'warn', false))
            this.releaseVFunction(name)
        }
        this.activeVFunctions[register] = {
            name,
            metadata
        }
    }

    releaseVFunction(name) {
        const register = this.getVariable(name)
        if (!this.activeVFunctions[register]) {
            log(new LogData(`Attempted to release a non-existant vfunction ${name} at register ${register}! Skipping`, 'warn', false))
            return
        }
        const activeVFunction = this.activeVFunctions[register]
        for (const borrowed of activeVFunction.metadata.dependencies) {
            this.releaseDefer(borrowed)
        }
        delete this.activeVFunctions[register]
    }

    randomRegister() {
        let register = crypto.randomInt(registerNames.length, 256);
        while (this.reservedRegisters.has(register)) {
            register = crypto.randomInt(registerNames.length, 256);
        }
        this.reservedRegisters.add(register);
        return register;
    }

    getAvailableTempLoad() {
        for (const [register, available] of Object.entries(this.available)) {
            if (available) {
                log(new LogData(`Allocating temp load register ${register}`, 'accent'))
                this.available[register] = false
                return this[register]
            }
        }
        log(new LogData('No available temp load registers!', 'error', false))
    }

    // remember to free the tempload after using it
    freeTempLoad(register) {
        if (this.available[this.TLMap[register]]) {
            log(new LogData(`Attempted to free already available temp load register ${this.TLMap[register]}`, 'warn'))
            return
        }
        if (!this.TLMap[register]) {
            log(new LogData(`Attempted to free non-tempload register ${register}! Skipping`, 'warn'))
            return
        }
        log(new LogData(`Freeing temp load register ${this.TLMap[register]} (${register})`, 'accent'))
        this.available[this.TLMap[register]] = true
    }

    generateOpcodeLabel() {
        while (true) {
            const label = crypto.randomBytes(16).toString('hex')
            if (!this.takenLabels.has(label)) {
                this.takenLabels.add(label)
                return label
            }
        }
    }

    enterVFuncContext(label) {
        this.contextLabels.vfunc.push(label)
        this.vfuncReferences.push(new Set())
    }

    exitVFuncContext() {
        this.contextLabels.vfunc.pop()
        this.vfuncReferences.pop()
    }

    enterContext(type, label) {
        this.contextLabels[type].push(label)
    }

    exitContext(type) {
        this.contextLabels[type].pop()
    }

    getActiveLabel(type) {
        return this.contextLabels[type][this.contextLabels[type].length - 1]
    }

    // this is probably an expression
    handleNode(node) {
        if (!node) {
            log(new LogData('Attempted to handle null node! Skipping', 'warn', false))
            return
        }
        // for vfuncs
        if (needsCleanup(node)) {
            const out = this.resolveExpression(node).outputRegister
            this.freeTempLoad(out)
            return
        }
        switch (node.type) {
            case 'BlockStatement': {
                this.generate(node.body);
                break;
            }
            case 'IfStatement': {
                this.resolveIfStatement(node)
                break;
            }
            case 'TryStatement': {
                this.resolveTryStatement(node)
                break
            }
            case 'ThrowStatement': {
                this.resolveThrowStatement(node)
                break
            }
            case 'ForStatement': {
                this.resolveForStatement(node)
                break
            }
            case 'ForOfStatement': {
                this.resolveForOfStatement(node)
                break
            }
            case 'ForInStatement': {
                this.resolveForInStatement(node)
                break
            }
            case 'WhileStatement': {
                this.resolveWhileStatement(node)
                break
            }
            case 'VariableDeclaration': {
                for (const declaration of node.declarations) {
                    if (declaration.id.type === 'ArrayPattern') {
                        const arrayRegister = this.resolveExpression(declaration.init).outputRegister
                        const counterRegister = this.getAvailableTempLoad()
                        const oneRegister = this.getAvailableTempLoad()

                        this.chunk.append(new Opcode('LOAD_DWORD', counterRegister, encodeDWORD(0)));
                        this.chunk.append(new Opcode('LOAD_DWORD', oneRegister, encodeDWORD(1)));

                        for (let i = 0; i < declaration.id.elements.length; i++) {
                            const element = declaration.id.elements[i]
                            assert(element.type === 'Identifier', 'ArrayPattern element is not an Identifier!')
                            this.declareVariable(element.name, this.randomRegister())
                            this.chunk.append(new Opcode('GET_INDEX', this.getVariable(element.name), arrayRegister, counterRegister))
                            this.chunk.append(new Opcode('ADD', counterRegister, counterRegister, oneRegister))
                        }
                        this.freeTempLoad(counterRegister)
                        this.freeTempLoad(oneRegister)
                        if (needsCleanup(declaration.init)) this.freeTempLoad(arrayRegister)
                        continue
                    }
                    if (declaration.id.type === 'ObjectPattern') {
                        const objectRegister = this.resolveExpression(declaration.init).outputRegister
                        for (const property of declaration.id.properties) {
                            const {key, value} = property
                            assert(key.type === 'Identifier', 'ObjectPattern key is not an Identifier!')
                            assert(value.type === 'Identifier', 'ObjectPattern value is not an Identifier!')
                            this.declareVariable(value.name, this.randomRegister())
                            const propRegister = this.randomRegister()
                            const prop = new BytecodeValue(key.name, propRegister)
                            this.chunk.append(prop.getLoadOpcode())
                            this.chunk.append(new Opcode('GET_PROP', this.getVariable(value.name), objectRegister, propRegister))
                            this.freeTempLoad(propRegister)
                        }
                        if (needsCleanup(declaration.init)) this.freeTempLoad(objectRegister)
                        continue
                    }
                    if (declaration.init) {
                        let out
                        switch (declaration.init.type) {
                            case 'FunctionExpression':
                            case 'ArrowFunctionExpression':
                            case 'FunctionDeclaration': {
                                const {dependencies} = this.resolveFunctionDeclaration(declaration.init, {
                                    declareName: declaration.id.name
                                })
                                return;
                            }
                            default: {
                                out = this.resolveExpression(declaration.init).outputRegister
                                if (needsCleanup(declaration.init)) this.freeTempLoad(out)
                            }
                        }
                        this.declareVariable(declaration.id.name, this.randomRegister());
                        this.chunk.append(new Opcode('SET_REF', this.getVariable(declaration.id.name), out));
                        if (needsCleanup(declaration.init)) this.freeTempLoad(out)
                    }
                }
                break;
            }
            case 'FunctionExpression':
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration': {
                const name = node.id.name
                this.resolveFunctionDeclaration(node, {
                    declareName: name
                })
                log(`FunctionDeclaration result is at ${this.getVariable(name)}`)
                break
            }
            case 'ExpressionStatement': {
                const out = this.resolveExpression(node.expression).outputRegister
                if (needsCleanup(node.expression)) this.freeTempLoad(out)
                break
            }
            case 'BreakStatement': {
                const opcode = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
                opcode.markForProcessing(this.getActiveLabel('loops'), {
                    type: 'break',
                    ip: this.chunk.getCurrentIP()
                })
                this.chunk.append(opcode)
                this.processStack.push(opcode)
                break
            }
            case 'ContinueStatement': {
                const opcode = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
                opcode.markForProcessing(this.getActiveLabel('loops'), {
                    type: 'continue',
                    ip: this.chunk.getCurrentIP()
                })
                this.chunk.append(opcode)
                this.processStack.push(opcode)
                break
            }
            case 'ReturnStatement': {
                const out = this.resolveExpression(node.argument).outputRegister
                if (this.getActiveLabel('vfunc')) {
                    const opcode = new Opcode('SET_REF', 0, out)
                    opcode.markForProcessing(this.getActiveLabel('vfunc'), {
                        type: 'vfunc_return',
                        computedOutput: out
                    })
                    this.processStack.push(opcode)
                    this.chunk.append(opcode)
                    this.chunk.append(new Opcode('END'))
                } else {
                    this.chunk.append(new Opcode('SET_REF', this.outputRegister, out));
                }
                if (needsCleanup(node.argument)) this.freeTempLoad(out)
            }
        }
    }

    // generate bytecode for all converted values
    generate(block, options) {
        block = block ?? this.ast
        options = options ?? {}

        this.activeScopes.push([])
        // perform a DFS on the block
        for (const node of block) {
            this.handleNode(node, options)
        }
        // discard all variables in the current scope
        for (const variableName of this.activeScopes.pop()) {
            log(new LogData(`Dropping variable ${variableName}`, 'accent', false))
            this.dropVariable(variableName)
        }
    }

    getBytecode() {
        log(`\nResulting Bytecode:\n\n${this.chunk.toString()}`)
        return this.chunk.toBytes();
    }
}

module.exports = {
    FunctionBytecodeGenerator
};
