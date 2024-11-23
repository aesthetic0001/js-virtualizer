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

    isNestedBinaryExpression(node) {
        return node.left.type === 'BinaryExpression' || node.right.type === 'BinaryExpression'
    }

    freeTempLoad(register) {
        this.available[this.TLMap[register]] = true
    }

    // remember to free the tempload after using it
    evaluateBinaryExpression(node) {
        const {left, right, operator} = node;
        const opcode = operatorToOpcode(operator);

        let finalL, finalR
        let leftIsImmutable = false, rightIsImmutable = false

        log(`Evaluating binary expression: ${left.type} ${operator} ${right.type}`)

        // dfs down before evaluating
        if (left.type === 'BinaryExpression' && this.isNestedBinaryExpression(left)) {
            finalL = this.evaluateBinaryExpression(left);
            log(`Merged result left is at ${this.TLMap[finalL]}`)
        }

        if (right.type === 'BinaryExpression' && this.isNestedBinaryExpression(right)) {
            finalR = this.evaluateBinaryExpression(right);
            log(`Merged result right is at ${this.TLMap[finalR]}`)
        }

        if (!finalL) {
            switch (left.type) {
                case 'BinaryExpression': {
                    finalL = this.evaluateBinaryExpression(left);
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
                    finalR = this.evaluateBinaryExpression(right);
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
        const leftTL = this.TLMap[finalL]
        const rightTL = this.TLMap[finalR]
        const mergedTL = this.TLMap[mergeTo]
        log(`Merge result stored in ${mergedTL}`)
        if (leftTL && leftTL !== mergedTL) {
            this.freeTempLoad(finalL)
            log(`Freed ${leftTL}`)
        }
        if (rightTL && rightTL !== mergedTL) {
            this.freeTempLoad(finalR)
            log(`Freed ${rightTL}`)
        }
        log(`Evaluated binary expression: ${left.type} ${operator} ${right.type} to ${this.TLMap[mergeTo]}`)
        return mergeTo
    }

    isNestedMemberExpression(node) {
        return node.object.type === 'MemberExpression' || node.property.type === 'MemberExpression'
    }

    // returns the register with the result of the expression
    resolveMemberExpression(node) {
        const {object, property, computed} = node;
        let objectRegister, propertyRegister
        let objectIsImmutable = false, propertyIsImmutable = false
        log(`Resolving member expression: ${object.type}.${property.type}`)

        if (object.type === 'MemberExpression' && this.isNestedMemberExpression(object)) {
            objectRegister = this.resolveMemberExpression(object);
            log(`Merged object result is at ${this.TLMap[objectRegister]}`)
        }

        if (property.type === 'MemberExpression' && this.isNestedMemberExpression(property)) {
            propertyRegister = this.resolveMemberExpression(property);
            log(`Merged property result is at ${this.TLMap[propertyRegister]}`)
        }

        if (!objectRegister) {
            switch (object.type) {
                case 'MemberExpression': {
                    objectRegister = this.resolveMemberExpression(object);
                    log(`Merged object result is at ${this.TLMap[objectRegister]}`)
                    break;
                }
                case 'Identifier': {
                    objectRegister = this.getVariable(object.name);
                    objectIsImmutable = true
                    log(`Loaded object: ${object.name} at register ${objectRegister}`)
                    break;
                }
                case 'Literal': {
                    const value = new BytecodeValue(object.value, this.getAvailableTempLoad());
                    this.chunk.append(value.getLoadOpcode());
                    objectRegister = value.register
                    log(`Loaded object: ${object.value} at register ${objectRegister}`)
                    break;
                }
                case 'CallExpression': {
                    // todo: impl
                }
            }
        }

        if (!propertyRegister) {
            switch (property.type) {
                case 'MemberExpression': {
                    propertyRegister = this.resolveMemberExpression(property);
                    log(`Merged property result is at ${this.TLMap[propertyRegister]}`)
                    break;
                }
                case 'Identifier': {
                    if (computed) {
                        propertyRegister = this.getVariable(property.name);
                        propertyIsImmutable = true
                        log(`Loaded property: ${property.name} at register ${propertyRegister}`)
                    } else {
                        log(new LogData('Treating non-computed identifier as literal', 'warn', false))
                        const value = new BytecodeValue(property.name, this.getAvailableTempLoad());
                        propertyRegister = value.register
                        this.chunk.append(value.getLoadOpcode());
                    }
                    break
                }
                case 'Literal': {
                    const value = new BytecodeValue(property.value, this.getAvailableTempLoad());
                    this.chunk.append(value.getLoadOpcode());
                    propertyRegister = value.register
                    log(`Loaded property: ${property.value} at register ${propertyRegister}`)
                    break;
                }
                case 'CallExpression': {
                    break
                }
            }
        }

        const mergeTo = (objectIsImmutable) ? (propertyIsImmutable ? this.getAvailableTempLoad() : propertyRegister) : objectRegister
        this.chunk.append(new Opcode('GET_PROP', mergeTo, objectRegister, propertyRegister));
        const objectTL = this.TLMap[objectRegister]
        const propertyTL = this.TLMap[propertyRegister]
        const mergedTL = this.TLMap[mergeTo]

        log(`Prop result stored in ${mergedTL}`)

        if (objectTL && objectTL !== mergedTL) {
            this.freeTempLoad(objectRegister)
            log(`Freed ${objectTL}`)
        }

        if (propertyTL && propertyTL !== mergedTL) {
            this.freeTempLoad(propertyRegister)
            log(`Freed ${propertyTL}`)
        }

        return mergeTo
    }

    //
    // resolveCallExpression(node, outputRegister) {
    //     outputRegister = outputRegister ?? this.randomRegister();
    //
    //     return outputRegister
    // }

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
                                    const out = this.evaluateBinaryExpression(declaration.init);
                                    log(`Loading binary expression into variable ${declaration.id.name} at register ${this.getVariable(declaration.id.name)}`)
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
                                    rightRegister = this.evaluateBinaryExpression(right);
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
                            const out = this.evaluateBinaryExpression(node.argument)
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
