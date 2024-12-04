const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// ALWAYS produces a mutable result, ownership is transferred to the caller
function resolveArrayExpression(node) {
    const {elements} = node

    const arrayRegister = this.getAvailableTempLoad()
    const counterRegister = this.getAvailableTempLoad()
    const oneRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('SETUP_ARRAY', arrayRegister, encodeDWORD(elements.length)));
    this.chunk.append(new Opcode('LOAD_DWORD', counterRegister, encodeDWORD(0)));
    this.chunk.append(new Opcode('LOAD_DWORD', oneRegister, encodeDWORD(1)));

    elements.forEach((element) => {
        const elementRegister = this.resolveExpression(element).outputRegister
        this.chunk.append(new Opcode('SET_INDEX', arrayRegister, counterRegister, elementRegister));
        if (needsCleanup(element)) this.freeTempLoad(elementRegister)
        this.chunk.append(new Opcode('ADD', counterRegister, counterRegister, oneRegister))
    })
    this.freeTempLoad(counterRegister)
    this.freeTempLoad(oneRegister)
    return arrayRegister
}

module.exports = resolveArrayExpression
