const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue, encodeArrayRegisters} = require("../utils/assembler");
const {registers} = require("../utils/constants");

function isNestedCallExpression(node) {
    return node.callee.type === 'CallExpression' || node.arguments.some(arg => arg.type === 'CallExpression')
}

// returns the register with the result of the expression
function resolveCallExpression(node) {
    const {callee, arguments} = node;
    let calleeRegister, argumentRegisters = []
    let reuseCandidate = null
    log(`Resolving call expression: ${callee.type}(${arguments.map(arg => arg.type).join(', ')})`)

    if (callee.type === 'CallExpression' && isNestedCallExpression(callee)) {
        calleeRegister = this.resolveMemberExpression(callee);
        log(`Merged callee result is at ${this.TLMap[calleeRegister]}`)
    }

    argumentRegisters = arguments.map(arg => {
        switch (arg.type) {
            case 'CallExpression': {
                if (isNestedCallExpression(arg)) {
                    return this.resolveMemberExpression(arg);
                }
                return arg
            }
        }
    })

    if (!calleeRegister) {
        switch (callee.type) {
            case 'CallExpression': {
                calleeRegister = this.resolveMemberExpression(callee);
                reuseCandidate = calleeRegister
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
                reuseCandidate = calleeRegister
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

    const alloced = []

    argumentRegisters = argumentRegisters.map(arg => {
        switch (arg.type) {
            case 'CallExpression': {
                return this.resolveMemberExpression(arg);
            }
            case 'Identifier': {
                return this.getVariable(arg.name);
            }
            case 'Literal': {
                const value = new BytecodeValue(arg.value, this.randomRegister());
                this.chunk.append(value.getLoadOpcode());
                alloced.push(value.register)
                return value.register
            }
            case 'BinaryExpression': {
                return this.resolveBinaryExpression(arg);
            }
            case 'MemberExpression': {
                return this.resolveMemberExpression(arg);
            }
        }
    })
    const mergeTo = reuseCandidate ?? this.getAvailableTempLoad()
    this.chunk.append(new Opcode('FUNC_CALL', calleeRegister, mergeTo, registers.VOID, ...encodeArrayRegisters(argumentRegisters)));
    log(`Merged call result is at ${this.TLMap[mergeTo]} (${mergeTo})`)
    for (const reg of alloced) {
        this.removeRegister(reg)
    }
    return mergeTo
}

module.exports = resolveCallExpression
