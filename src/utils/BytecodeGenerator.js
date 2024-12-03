const {VMChunk, Opcode} = require("./assembler");
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

const TL_COUNT = 14

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

        this.resolveExpression = resolveExpression.bind(this)
        this.resolveBinaryExpression = resolveBinaryExpression.bind(this)
        this.resolveMemberExpression = resolveMemberExpression.bind(this)
        this.resolveCallExpression = resolveCallExpression.bind(this)
        this.resolveObjectExpression = resolveObjectExpression.bind(this)
        this.resolveArrayExpression = resolveArrayExpression.bind(this)
        this.resolveNewExpression = resolveNewExpression.bind(this)
        this.resolveUnaryExpression = resolveUnaryExpression.bind(this)
        this.resolveUpdateExpression = resolveUpdateExpression.bind(this)

        this.resolveIfStatement = resolveIfStatement.bind(this)
        this.resolveForStatement = resolveForStatement.bind(this)
    }

    declareVariable(variableName, register) {
        if (this.activeVariables[variableName]) {
            this.activeVariables[variableName].push(register || this.randomRegister())
        } else {
            this.activeVariables[variableName] = [register || this.randomRegister()]
        }
        this.activeScopes[this.activeScopes.length - 1].push(variableName)
    }

    getVariable(variableName) {
        log(`Getting variable ${variableName}`)
        const scopeArray = this.activeVariables[variableName]
        if (!scopeArray) {
            log(new LogData(`Variable ${variableName} not found in scope!`, 'error', false))
            throw new Error(`Variable ${variableName} not found in scope!`)
        }
        return scopeArray[scopeArray.length - 1]
    }

    removeRegister(register) {
        this.reservedRegisters.delete(register);
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
                this.available[register] = false
                return this[register]
            }
        }
        log(new LogData('No available temp load registers!', 'error', false))
    }

    // remember to free the tempload after using it
    freeTempLoad(register) {
        if (this.available[this.TLMap[register]]) {
            log(new LogData(`Attempted to free already available temp load register ${this.TLMap[register]}`, 'warn', false))
            return
        }
        if (!this.TLMap[register]) {
            log(new LogData(`Attempted to free non-tempload register ${register}! Skipping`, 'warn', false))
            return
        }
        this.available[this.TLMap[register]] = true
    }

    handleNode(node) {
        // this is probably an expression
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
            case 'ForStatement': {
                this.resolveForStatement(node)
                break
            }
            case 'VariableDeclaration': {
                for (const declaration of node.declarations) {
                    this.declareVariable(declaration.id.name, this.randomRegister());
                    if (declaration.init) {
                        const out = this.resolveExpression(declaration.init).outputRegister
                        this.chunk.append(new Opcode('SET_REF', this.getVariable(declaration.id.name), out));
                        if (needsCleanup(declaration.init)) this.freeTempLoad(out)
                    }
                }
                break;
            }
            case 'ExpressionStatement': {
                switch (node.expression.type) {
                    case 'AssignmentExpression': {
                        const {left, right, operator} = node.expression;
                        const leftRegister = this.getVariable(left.name);
                        const rightRegister = this.resolveExpression(right).outputRegister

                        switch (operator) {
                            case '=': {
                                log(`Evaluating regular assignment expression with SET_REF`)
                                this.chunk.append(new Opcode('SET_REF', leftRegister, rightRegister));
                                break;
                            }
                            default: {
                                const opcode = binaryOperatorToOpcode(operator.slice(0, -1));
                                log(`Evaluating inclusive assignment expression with ${operator} using ${opcode}`)
                                this.chunk.append(new Opcode(opcode, leftRegister, leftRegister, rightRegister));
                            }
                        }
                        break;
                    }
                    default: {
                        const out = this.resolveExpression(node.expression).outputRegister
                        if (needsCleanup(node.expression)) this.freeTempLoad(out)
                        break
                    }
                }
                break
            }
            case 'ReturnStatement': {
                const out = this.resolveExpression(node.argument).outputRegister
                this.chunk.append(new Opcode('SET_REF', this.outputRegister, out));
                if (needsCleanup(node.argument)) this.freeTempLoad(out)
            }
        }
    }

    // generate bytecode for all converted values
    generate(block) {
        block = block || this.ast
        this.activeScopes.push([])
        // perform a DFS on the block
        for (const node of block) {
            this.handleNode(node)
        }
        // discard all variables in the current scope
        for (const variableName of this.activeScopes.pop()) {
            const allocatedRegister = this.activeVariables[variableName].pop()
            this.removeRegister(allocatedRegister)
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
