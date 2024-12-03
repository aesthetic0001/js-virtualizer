const {log, LogData} = require("../utils/log");
const {encodeDWORD, Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveForOfStatement(node) {
    const {left, right, body} = node;

    log(new LogData(`Resolving for .. of`, 'accent', true))

    const iterator = this.resolveExpression(right)
    const iteratorRegister = iterator.borrowed ? this.getAvailableTempLoad() : iterator.outputRegister
    const testRegister = this.getAvailableTempLoad()
    this.declareVariable(left.declarations[0].id.name, this.getAvailableTempLoad())
    const variableRegister = this.getVariable(left.declarations[0].id.name)
    log(`Declaring iteration store variable ${left.declarations[0].id.name} with register ${iteratorRegister}`)

    this.chunk.append(new Opcode('GET_ITERATOR', iteratorRegister, iterator.outputRegister))
    const startIP = this.chunk.getCurrentIP()
    this.chunk.append(new Opcode('ITERATOR_NEXT', variableRegister, iteratorRegister))
    this.chunk.append(new Opcode('ITERATOR_DONE', testRegister, variableRegister))
    this.chunk.append(new Opcode('ITERATOR_VALUE', variableRegister, variableRegister))
    this.chunk.append(new Opcode('TEST', testRegister, testRegister))
    const endJump = new Opcode('JUMP_EQ', testRegister, encodeDWORD(0))
    this.chunk.append(endJump)

    this.handleNode(body)

    this.chunk.append(new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(startIP - this.chunk.getCurrentIP())))

    endJump.modifyArgs(testRegister, encodeDWORD(this.chunk.getCurrentIP() - endJump.id))

    if (needsCleanup(right)) this.freeTempLoad(iterator)
    if (iterator.borrowed) this.freeTempLoad(iteratorRegister)
    this.freeTempLoad(testRegister)
}

module.exports = resolveForOfStatement
