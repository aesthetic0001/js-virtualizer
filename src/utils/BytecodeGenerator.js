const {VMChunk, Opcode, encodeDWORD, encodeFloat, encodeString} = require("./assembler");
const crypto = require("crypto");
const {registerNames} = require("./constants");
const {log, LogData} = require("./log");

class BytecodeValue {
    constructor(value, register, type) {
        this.type = type || this.getBytecodeType(value);
        this.value = value;
        this.register = register;
    }

    getBytecodeType(Literal) {
        switch (typeof Literal) {
            case 'number': {
                return Number.isInteger(Literal) ? 'DWORD' : 'FLOAT';
            }
            case 'string': {
                return 'STRING';
            }
        }
    }

    getLoadOpcode() {
        let encoded
        switch (this.type) {
            case 'BYTE': {
                encoded = this.value;
                break;
            }
            case 'DWORD': {
                encoded = encodeDWORD(this.value);
                break;
            }
            case 'FLOAT': {
                encoded = encodeFloat(this.value);
                break;
            }
            case 'STRING': {
                encoded = encodeString(this.value);
                break;
            }
        }
        return new Opcode(`LOAD_${this.type}`, this.register, encoded);
    }
}

function operatorToOpcode(operator) {
    switch (operator) {
        case '+': {
            return 'ADD';
        }
        case '-': {
            return 'SUBTRACT';
        }
        case '*': {
            return 'MULTIPLY';
        }
        case '/': {
            return 'DIVIDE';
        }
        case '%': {
            return 'MODULO';
        }
        case '**': {
            return 'POWER';
        }
    }
}

const TL_COUNT = 4

class FunctionBytecodeGenerator {
    constructor(ast, chunk) {
        this.ast = ast;
        this.chunk = chunk || new VMChunk();
        this.reservedRegisters = new Set()
        this.outputRegister = this.randomRegister();

        // for arithmetics
        this.available = {}
        this.TLMap = {}
        for (let i = 1; i <= TL_COUNT; i++) {
            const regName = `TL${i}`
            this[regName] = this.randomRegister();
            this.TLMap[this[regName]] = regName
            this.available[regName] = true
        }
        this.previousLoad = null
        this.mergeResult = null

        log(new LogData(`Output register: ${this.outputRegister}`, 'accent', false))

        // for variable contexts
        // variables declared by the scope, array of array of variable names
        // 0th element is the global scope, subsequent elements are nested scopes
        this.activeScopes = [[]]
        // variables that are currently in the active scope, map of variable name to array of registers,
        // where the last element is the most recent register (active reference)
        this.activeVariables = {}
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
        const scopeArray = this.activeVariables[variableName]
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

    isNestedBinaryExpression(node) {
        return node.left.type === 'BinaryExpression' || node.right.type === 'BinaryExpression'
    }

    evaluateBinaryExpression(node, root = true) {
        const {left, right, operator} = node;
        const opcode = operatorToOpcode(operator);

        if (root) {
            // reset the available registers
            for (const [register, _] of Object.entries(this.available)) {
                this.available[register] = true
            }
        }

        let finalL, finalR
        let leftIsImmutable = false, rightIsImmutable = false

        log(`Evaluating binary expression: ${left.type} ${operator} ${right.type}`)

        // dfs down before evaluating
        if (left.type === 'BinaryExpression' && this.isNestedBinaryExpression(left)) {
            this.evaluateBinaryExpression(left, false);
            finalL = this.mergeResult
            log(`Merged result left is at ${this.TLMap[finalL]}`)
        }

        if (right.type === 'BinaryExpression' && this.isNestedBinaryExpression(right)) {
            this.evaluateBinaryExpression(right, false);
            finalR = this.mergeResult
            log(`Merged result right is at ${this.TLMap[finalR]}`)
        }

        if (!finalL) {
            switch (left.type) {
                case 'BinaryExpression': {
                    this.evaluateBinaryExpression(left, false);
                    finalL = this.mergeResult
                    log(`Merged result left is at ${this.TLMap[finalL]}`)
                    break;
                }
                case 'Literal': {
                    const reg = this.getAvailableTempLoad()
                    finalL = reg
                    const valueLeft = new BytecodeValue(left.value, reg);
                    this.chunk.append(valueLeft.getLoadOpcode());
                    log(`Loaded literal left: ${left.value} into ${this.TLMap[reg]}`)
                    break;
                }
                case 'Identifier': {
                    finalL = this.getVariable(left.name);
                    leftIsImmutable = true
                    log(`Loaded variable left: ${left.name} at register ${finalL}`)
                    break;
                }
            }
        }

        if (!finalR) {
            switch (right.type) {
                case 'BinaryExpression': {
                    this.evaluateBinaryExpression(right, false);
                    finalR = this.mergeResult
                    log(`Merged result right is at ${this.TLMap[finalR]}`)
                    break;
                }
                case 'Literal': {
                    const reg = this.getAvailableTempLoad()
                    finalR = reg
                    const valueRight = new BytecodeValue(right.value, reg);
                    this.chunk.append(valueRight.getLoadOpcode());
                    log(`Loaded literal right: ${right.value} into ${this.TLMap[reg]}`)
                    break;
                }
                case 'Identifier': {
                    finalR = this.getVariable(right.name);
                    rightIsImmutable = true
                    log(`Loaded variable right: ${right.name} at register ${finalR}`)
                    break
                }
            }
        }

        // always merge to the left
        const mergeTo = (leftIsImmutable) ? (rightIsImmutable ? this.getAvailableTempLoad() : finalR) : finalL
        this.chunk.append(new Opcode(opcode, mergeTo, finalL, finalR));
        this.mergeResult = mergeTo
        const leftTL = this.TLMap[finalL]
        const rightTL = this.TLMap[finalR]
        const mergedTL = this.TLMap[mergeTo]
        log(`Merge result stored in ${mergedTL}`)
        if (leftTL && leftTL !== mergedTL) {
            this.available[leftTL] = true
            log(`Freed ${leftTL}`)
        }
        if (rightTL && rightTL !== mergedTL) {
            this.available[rightTL] = true
            log(`Freed ${rightTL}`)
        }
        this.previousLoad = mergeTo
        log(`Evaluated binary expression: ${left.type} ${operator} ${right.type} to ${this.TLMap[mergeTo]}`)
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
                            const value = new BytecodeValue(declaration.init.value, this.getVariable(node.id.name));
                            this.chunk.append(value.getLoadOpcode());
                        }
                    }
                    break;
                }
                case 'VariableDeclarator': {
                    this.declareVariable(node.id.name, this.randomRegister());
                    if (node.init) {
                        const value = new BytecodeValue(node.init.value, this.getVariable(node.id.name));
                        this.chunk.append(value.getLoadOpcode());
                    }
                    break;
                }
                case 'BinaryExpression': {
                    this.evaluateBinaryExpression(node);
                    break;
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
                            this.evaluateBinaryExpression(node.argument);
                            this.chunk.append(new Opcode('SET_REF', this.outputRegister, this.previousLoad));
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
