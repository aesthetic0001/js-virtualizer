const {log, LogData} = require("../utils/log");
const {encodeDWORD, Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// VOID result, all registers are cleaned up before returning
function resolveForInStatement(node) {
    const {left, right, body} = node;

    log(new LogData(`Resolving for .. in`, 'accent', true))

    const rhs = this.resolveExpression(right)
    const iteratorRegister = rhs.borrowed ? this.getAvailableTempLoad() : rhs.outputRegister
    this.chunk.append(new Opcode('GET_PROPERTIES', iteratorRegister, rhs.outputRegister))
    const testRegister = this.getAvailableTempLoad()
    this.declareVariable(left.declarations[0].id.name, this.getAvailableTempLoad())
    const variableRegister = this.getVariable(left.declarations[0].id.name)
    log(`Declaring iteration store variable ${left.declarations[0].id.name} with register ${iteratorRegister}`)

    this.chunk.append(new Opcode('GET_ITERATOR', iteratorRegister, iteratorRegister))
    const startIP = this.chunk.getCurrentIP()
    this.chunk.append(new Opcode('ITERATOR_NEXT', variableRegister, iteratorRegister))
    this.chunk.append(new Opcode('ITERATOR_DONE', testRegister, variableRegister))
    this.chunk.append(new Opcode('ITERATOR_VALUE', variableRegister, variableRegister))
    this.chunk.append(new Opcode('TEST', testRegister, testRegister))
    const endJumpIP = this.chunk.getCurrentIP()
    const endJump = new Opcode('JUMP_EQ', testRegister, encodeDWORD(0))
    this.chunk.append(endJump)

    this.handleNode(body)

    this.chunk.append(new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(startIP - this.chunk.getCurrentIP())))

    endJump.modifyArgs(testRegister, encodeDWORD(this.chunk.getCurrentIP() - endJumpIP))

    if (needsCleanup(right)) this.freeTempLoad(rhs.outputRegister)
    if (rhs.borrowed) this.freeTempLoad(iteratorRegister)
    this.freeTempLoad(testRegister)
    this.freeTempLoad(variableRegister)
}

module.exports = resolveForInStatement
