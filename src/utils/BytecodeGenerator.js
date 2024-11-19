const {VMChunk, Opcode, encodeDWORD, encodeFloat, encodeString} = require("./assembler");
const crypto = require("crypto");
const {registerNames} = require("./constants");

class BytecodeValue {
    constructor(type, value, register) {
        this.type = type;
        this.value = value;
        this.register = register;
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

function getBytecodeType(Literal) {
    switch (typeof Literal) {
        case 'number': {
            return Number.isInteger(Literal) ? 'DWORD' : 'FLOAT';
        }
        case 'string': {
            return 'STRING';
        }
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

class FunctionBytecodeGenerator {
    constructor(ast, chunk) {
        this.ast = ast;
        this.chunk = chunk || new VMChunk();
        this.reservedRegisters = new Set()
        this.outputRegister = this.randomRegister();

        // for literal arithmetics
        this.accumulatorRegister = this.randomRegister();
        this.loadRegister = this.randomRegister();

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

    evaluateBinaryExpression(node) {
        const {left, right, operator} = node;
        const opcode = operatorToOpcode(operator);
        switch (left.type) {
            case 'BinaryExpression': {
                this.evaluateBinaryExpression(left);
                break;
            }
            case 'Literal': {
                const type = getBytecodeType(left.value);
                const value = new BytecodeValue(type, left.value, this.accumulatorRegister);
                this.chunk.append(value.getLoadOpcode());
                return;
            }
            case 'Identifier': {
                const register = this.activeVariables[left.name][this.activeVariables[left.name].length - 1];
                this.chunk.append(new Opcode(`SET`, this.accumulatorRegister, register));
                return;
            }
        }
        switch (right.type) {
            case 'BinaryExpression': {
                this.evaluateBinaryExpression(right);
                break;
            }
            case 'Literal': {
                const type = getBytecodeType(right.value);
                const value = new BytecodeValue(type, right.value, this.loadRegister);
                this.chunk.append(value.getLoadOpcode());
                this.chunk.append(new Opcode(opcode, this.accumulatorRegister, this.accumulatorRegister, this.loadRegister));
                return;
            }
            case 'Identifier': {
                const register = this.activeVariables[right.name][this.activeVariables[right.name].length - 1];
                this.chunk.append(new Opcode(`SET`, this.loadRegister, register));
                this.chunk.append(new Opcode(opcode, this.accumulatorRegister, this.accumulatorRegister, this.loadRegister));
                return
            }
        }
        // if both left and right are binary expressions
        this.chunk.append(new Opcode(opcode, this.accumulatorRegister, this.accumulatorRegister, this.loadRegister));
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
                            const type = getBytecodeType(declaration.init.value);
                            const value = new BytecodeValue(type, declaration.init.value, this.activeVariables[declaration.id.name][0]);
                            this.chunk.append(value.getLoadOpcode());
                        }
                    }
                    break;
                }
                case 'VariableDeclarator': {
                    this.declareVariable(node.id.name, this.randomRegister());
                    if (node.init) {
                        const type = getBytecodeType(node.init.value);
                        const value = new BytecodeValue(type, node.init.value, this.activeVariables[node.id.name][0]);
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
                            const type = getBytecodeType(node.argument.value);
                            const value = new BytecodeValue(type, node.argument.value, this.outputRegister);
                            this.chunk.append(value.getLoadOpcode());
                            break;
                        }
                        case 'Identifier': {
                            const register = this.activeVariables[node.argument.name][this.activeVariables[node.argument.name].length - 1];
                            this.chunk.append(new Opcode(`SET`, this.outputRegister, register));
                            break;
                        }
                        case 'BinaryExpression': {
                            this.evaluateBinaryExpression(node.argument);
                            this.chunk.append(new Opcode(`SET`, this.outputRegister, this.accumulatorRegister));
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
        console.log(this.chunk.toString());
        return this.chunk.toBytes();
    }
}

module.exports = {
    FunctionBytecodeGenerator
};
