const {log} = require("../utils/log");
const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {registers, needsCleanup} = require("../utils/constants");

// ALWAYS produces a mutable result, ownership is transferred to the caller
function resolveCallExpression(node) {
    const {callee, arguments} = node;

    log(`Resolving call expression: ${callee.type}(${arguments.map(arg => arg.type).join(', ')})`)

    const {outputRegister: calleeRegister, metadata} = this.resolveExpression(callee, {
        forceObjectImmutability: true
    })

    log(`Resolved callee at register ${calleeRegister} with this at register ${metadata.objectRegister ?? registers.VOID}`)

    const argsRegister = this.getAvailableTempLoad()
    const counterRegister = this.getAvailableTempLoad()
    const oneRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('SETUP_ARRAY', argsRegister, encodeDWORD(arguments.length)));
    this.chunk.append(new Opcode('LOAD_DWORD', counterRegister, encodeDWORD(0)));
    this.chunk.append(new Opcode('LOAD_DWORD', oneRegister, encodeDWORD(1)));

    log(`Arguments allocated at ${this.TLMap[argsRegister]} (${argsRegister}) with size ${arguments.length}`)
    log(`Counter register is at ${this.TLMap[counterRegister]} (${counterRegister})`)
    log(`One register is at ${this.TLMap[oneRegister]} (${oneRegister})`)

    arguments.forEach((arg, index) => {
        const valueRegister = this.resolveExpression(arg).outputRegister
        log(`Loaded argument ${index} (${arguments[index].type}) at register ${valueRegister}`)
        this.chunk.append(new Opcode('SET_INDEX', argsRegister, counterRegister, valueRegister));
        if (needsCleanup(arg)) this.freeTempLoad(valueRegister)
        this.chunk.append(new Opcode('ADD', counterRegister, counterRegister, oneRegister));
    })

    const mergeTo = argsRegister
    this.chunk.append(new Opcode('FUNC_ARRAY_CALL', calleeRegister, mergeTo, metadata.objectRegister ?? registers.VOID, argsRegister));
    if (needsCleanup(callee)) this.freeTempLoad(calleeRegister)
    this.freeTempLoad(counterRegister)
    this.freeTempLoad(oneRegister)

    log(`CallExpression return value is at ${this.TLMap[mergeTo]} (${mergeTo})`)

    // free this register if it's a temporary load
    if (metadata.objectRegister) this.freeTempLoad(metadata.objectRegister)

    return mergeTo
}

module.exports = resolveCallExpression
