const {log} = require("../utils/log");
const {Opcode, encodeDWORD} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveNewExpression(node) {
    const {callee, arguments} = node;

    log(`Resolving NewExpression: ${callee.type}(${arguments.map(arg => arg.type).join(', ')})`)

    const {outputRegister: calleeRegister} = this.resolveExpression(callee)

    log(`Resolved callee at register ${calleeRegister}`)

    const argsRegister = this.getAvailableTempLoad()
    const counterRegister = this.getAvailableTempLoad()
    const oneRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('SETUP_ARRAY', argsRegister, encodeDWORD(arguments.length)));
    this.chunk.append(new Opcode('LOAD_DWORD', counterRegister, encodeDWORD(0)));
    this.chunk.append(new Opcode('LOAD_DWORD', oneRegister, encodeDWORD(1)));

    log(`Allocated array for arguments at ${this.TLMap[argsRegister]} (${argsRegister}) with size ${arguments.length}`)

    arguments.forEach((arg, index) => {
        const valueRegister = this.resolveExpression(arg).outputRegister
        log(`Loaded argument ${index} (${arguments[index].type}) at register ${valueRegister}`)
        this.chunk.append(new Opcode('SET_INDEX', argsRegister, counterRegister, valueRegister));
        if (needsCleanup(arg)) this.freeTempLoad(valueRegister)
        this.chunk.append(new Opcode('ADD', counterRegister, counterRegister, oneRegister));
    })

    const mergeTo = argsRegister
    this.chunk.append(new Opcode('INIT_CONSTRUCTOR', mergeTo, calleeRegister, argsRegister));
    if (needsCleanup(callee)) this.freeTempLoad(calleeRegister)
    this.freeTempLoad(counterRegister)
    this.freeTempLoad(oneRegister)

    log(`NewExpression return value is at ${this.TLMap[mergeTo]} (${mergeTo})`)

    return mergeTo
}

module.exports = resolveNewExpression
