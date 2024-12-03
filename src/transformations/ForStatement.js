const {log, LogData} = require("../utils/log");
const {encodeDWORD, Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveForStatement(node) {
    const {init, test, update} = node;

    log(new LogData(`Resolving generic for loop`, 'accent', true))

    this.handleNode(init)

    const startIP = this.chunk.getCurrentIP()

    const {outputRegister: testRegister, borrowed} = this.resolveExpression(test, {
        forceImmutableMerges: true
    })
    const testResult = borrowed ? this.getAvailableTempLoad() : testRegister

    this.chunk.append(new Opcode('TEST', testResult, testRegister))
    // this will exit the loop if the test fails
    const endJumpIP = this.chunk.getCurrentIP()
    const endJump = new Opcode('JUMP_NOT_EQ', testResult, encodeDWORD(0))
    this.chunk.append(endJump)

    this.handleNode(node.body)
    this.handleNode(update)

    this.chunk.append(new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(startIP - this.chunk.getCurrentIP())))
    endJump.modifyArgs(testResult, encodeDWORD(this.chunk.getCurrentIP() - endJumpIP))

    if (borrowed) this.freeTempLoad(testResult)
    if (needsCleanup(test)) this.freeTempLoad(testRegister)
}

module.exports = resolveForStatement
