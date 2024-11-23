const {VMChunk, Opcode, encodeDWORD, encodeFloat, encodeString, BytecodeValue} = require("./assembler");
const crypto = require("crypto");
const {registerNames, operatorToOpcode} = require("./constants");
const {log, LogData} = require("./log");
const resolveBinaryExpression = require("../transpile/BinaryExpression");
const resolveMemberExpression = require("../transpile/MemberExpression");
const resolveCallExpression = require("../transpile/CallExpression");

const TL_COUNT = 12

class FunctionBytecodeGenerator {
    constructor(ast, chunk) {
        this.ast = ast;
        this.chunk = chunk || new VMChunk();
        this.reservedRegisters = new Set()
        this.outputRegister = this.randomRegister();

        // for arithmetics and loading values
        // binary expressions requires 4 registers to evaluate to one TL register as the result
        // member expressions requires 4 as well and is done in a similar way
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

        this.resolveBinaryExpression = resolveBinaryExpression.bind(this)
        this.resolveMemberExpression = resolveMemberExpression.bind(this)
        this.resolveCallExpression = resolveCallExpression.bind(this)
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
        this.available[this.TLMap[register]] = true
    }

    // generate bytecode for all converted values
    generate(block) {
        block = block || this.ast
        this.activeScopes.push([])
        // perform a DFS on the block
        for (const node of block) {
            switch (node.type) {
                case 'BlockStatement': {
                    this.generate(node.body);
                    break;
                }
                case 'VariableDeclaration': {
                    for (const declaration of node.declarations) {
                        this.declareVariable(declaration.id.name, this.randomRegister());
                        if (declaration.init) {
                            switch (declaration.init.type) {
                                case 'Literal': {
                                    log(`Loading literal ${declaration.init.value} into variable ${declaration.id.name} at register ${this.getVariable(declaration.id.name)}`)
                                    const value = new BytecodeValue(declaration.init.value, this.getVariable(declaration.id.name));
                                    this.chunk.append(value.getLoadOpcode());
                                    break;
                                }
                                case 'Identifier': {
                                    const register = this.getVariable(declaration.init.name);
                                    log(`Loading variable ${declaration.init.name} into variable ${declaration.id.name} at register ${this.getVariable(declaration.id.name)}`)
                                    this.chunk.append(new Opcode('SET_REF', this.getVariable(declaration.id.name), register));
                                    break;
                                }
                                case 'BinaryExpression': {
                                    const out = this.resolveBinaryExpression(declaration.init);
                                    log(`Loading binary expression into variable ${declaration.id.name} at register ${this.getVariable(declaration.id.name)}`)
                                    this.chunk.append(new Opcode('SET_REF', this.getVariable(declaration.id.name), out));
                                    this.freeTempLoad(out)
                                    break;
                                }
                                case 'MemberExpression': {
                                    const out = this.resolveMemberExpression(declaration.init);
                                    log(`Loading member expression into variable ${declaration.id.name} at register ${this.getVariable(declaration.id.name)}`)
                                    this.chunk.append(new Opcode('SET_REF', this.getVariable(declaration.id.name), out));
                                    this.freeTempLoad(out)
                                    break;
                                }
                                case 'CallExpression': {
                                    const out = this.resolveCallExpression(declaration.init);
                                    log(`Loading call expression into variable ${declaration.id.name} at register ${this.getVariable(declaration.id.name)}`)
                                    this.chunk.append(new Opcode('SET_REF', this.getVariable(declaration.id.name), out));
                                    this.freeTempLoad(out)
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
                case 'ExpressionStatement': {
                    switch (node.expression.type) {
                        case 'AssignmentExpression': {
                            const {left, right, operator} = node.expression;
                            const register = this.getVariable(left.name);
                            let rightRegister
                            switch (right.type) {
                                case 'Literal': {
                                    const value = new BytecodeValue(right.value, this.randomRegister());
                                    this.chunk.append(value.getLoadOpcode());
                                    rightRegister = value.register
                                    break;
                                }
                                case 'Identifier': {
                                    rightRegister = this.getVariable(right.name);
                                    break;
                                }
                                case 'BinaryExpression': {
                                    rightRegister = this.resolveBinaryExpression(right);
                                    this.freeTempLoad(rightRegister)
                                    break;
                                }
                                case 'MemberExpression': {
                                    rightRegister = this.resolveMemberExpression(right);
                                    this.freeTempLoad(rightRegister)
                                    break;
                                }
                                case 'CallExpression': {
                                    log(`Evaluating call expression in assignment`)
                                    rightRegister = this.resolveCallExpression(right);
                                    this.freeTempLoad(rightRegister)
                                    break;
                                }
                            }

                            switch (operator) {
                                case '=': {
                                    log(`Evaluating regular assignment expression with SET_REF`)
                                    this.chunk.append(new Opcode('SET_REF', register, rightRegister));
                                    break;
                                }
                                default: {
                                    const opcode = operatorToOpcode(operator.slice(0, -1));
                                    log(`Evaluating inclusive assignment expression with ${operator} using ${opcode}`)
                                    this.chunk.append(new Opcode(opcode, register, register, rightRegister));
                                }
                            }
                            break;
                        }
                        case 'CallExpression': {
                            const out = this.resolveCallExpression(node.expression)
                            this.freeTempLoad(out)
                            break;
                        }
                    }
                    break
                }
                case 'ReturnStatement': {
                    switch (node.argument.type) {
                        case 'Literal': {
                            const value = new BytecodeValue(node.argument.value, this.outputRegister);
                            this.chunk.append(value.getLoadOpcode());
                            break;
                        }
                        case 'Identifier': {
                            const register = this.getVariable(node.argument.name);
                            this.chunk.append(new Opcode('SET_REF', this.outputRegister, register));
                            break;
                        }
                        case 'BinaryExpression': {
                            const out = this.resolveBinaryExpression(node.argument)
                            this.chunk.append(new Opcode('SET_REF', this.outputRegister, out));
                            this.freeTempLoad(out)
                            break;
                        }
                        case 'MemberExpression': {
                            const out = this.resolveMemberExpression(node.argument)
                            this.chunk.append(new Opcode('SET_REF', this.outputRegister, out));
                            this.freeTempLoad(out)
                            break;
                        }
                        case 'CallExpression': {
                            const out = this.resolveCallExpression(node.argument)
                            this.chunk.append(new Opcode('SET_REF', this.outputRegister, out));
                            this.freeTempLoad(out)
                            break;
                        }
                    }
                }
            }
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
