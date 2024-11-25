const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue, encodeArrayRegisters, encodeDWORD} = require("../utils/assembler");
const {registers, needsCleanup} = require("../utils/constants");

function isNestedCallExpression(node) {
    return node.callee.type === 'CallExpression' || node.arguments.some(arg => arg.type === 'CallExpression')
}

// returns the register with the result of the expression
function resolveCallExpression(node) {
    const {callee, arguments} = node;
    let calleeRegister, argumentRegisters

    log(`Resolving call expression: ${callee.type}(${arguments.map(arg => arg.type).join(', ')})`)

    if (callee.type === 'CallExpression' && isNestedCallExpression(callee)) {
        calleeRegister = this.resolveCallExpression(callee);
        log(`Merged callee result is at ${this.TLMap[calleeRegister]}`)
    }

    argumentRegisters = arguments.map(arg => {
        if (arg.type === 'CallExpression' && isNestedCallExpression(arg)) {
            // cleaned up in argumentRegisters.forEach
            return this.resolveCallExpression(arg);
        }
        return arg
    })

    if (!calleeRegister) {
        switch (callee.type) {
            case 'CallExpression': {
                calleeRegister = this.resolveCallExpression(callee);
                log(`Merged callee result is at ${this.TLMap[calleeRegister]}`)
                break;
            }
            case 'Identifier': {
                calleeRegister = this.getVariable(callee.name);
                log(`Loaded callee: ${callee.name} at register ${calleeRegister}`)
                break;
            }
            case 'Literal': {
                const value = new BytecodeValue(callee.value, this.getAvailableTempLoad());
                this.chunk.append(value.getLoadOpcode());
                calleeRegister = value.register
                log(`Loaded callee: ${callee.value} at register ${calleeRegister}`)
                break;
            }
            case 'BinaryExpression': {
                calleeRegister = this.resolveBinaryExpression(callee);
                break;
            }
            case 'MemberExpression': {
                calleeRegister = this.resolveMemberExpression(callee);
                break;
            }
        }
    }

    const argsRegister = this.getAvailableTempLoad()
    const counterRegister = this.getAvailableTempLoad()
    const oneRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('LOAD_DWORD', counterRegister, encodeDWORD(0)));
    this.chunk.append(new Opcode('LOAD_DWORD', oneRegister, encodeDWORD(1)));
    this.chunk.append(new Opcode('SETUP_ARRAY', argsRegister, argumentRegisters.length));
    log(`Allocated array for arguments at ${this.TLMap[argsRegister]} (${argsRegister})`)

    argumentRegisters.forEach((arg, index) => {
        let valueRegister
        if (typeof arg === 'number') {
            valueRegister = arg
        } else {
            switch (arg.type) {
                case 'CallExpression': {
                    valueRegister = this.resolveCallExpression(arg);
                    break
                }
                case 'Identifier': {
                    valueRegister = this.getVariable(arg.name);
                    break
                }
                case 'Literal': {
                    const tempRegister = this.getAvailableTempLoad();
                    const value = new BytecodeValue(arg.value, tempRegister);
                    this.chunk.append(value.getLoadOpcode());
                    valueRegister = value.register
                    break
                }
                case 'BinaryExpression': {
                    valueRegister = this.resolveBinaryExpression(arg);
                    break
                }
                case 'MemberExpression': {
                    valueRegister = this.resolveMemberExpression(arg);
                    break
                }
            }
        }
        log(`Loaded argument ${index} (${arguments[index].type}) at register ${valueRegister}`)
        this.chunk.append(new Opcode('SET_INDEX', argsRegister, counterRegister, valueRegister));
        if (typeof arg === 'number' || needsCleanup(arg)) this.freeTempLoad(valueRegister)
        this.chunk.append(new Opcode('ADD', counterRegister, counterRegister, oneRegister));
    })
    const mergeTo = argsRegister
    this.chunk.append(new Opcode('FUNC_ARRAY_CALL', calleeRegister, mergeTo, registers.VOID, argsRegister));
    if (needsCleanup(callee)) this.freeTempLoad(calleeRegister)
    this.freeTempLoad(counterRegister)
    this.freeTempLoad(oneRegister)
    log(`Merged call result is at ${this.TLMap[mergeTo]} (${mergeTo})`)
    return mergeTo
}

module.exports = resolveCallExpression
