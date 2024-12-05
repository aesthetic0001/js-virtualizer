const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// MUTABLE result, ownership is always passed to caller
function resolveConditionalExpression(node) {
    const {test, consequent, alternate} = node;

    if (!alternate) {
        log('No alternate!')
        throw new Error("No alternate clause found in conditional expression")
    }

    log(new LogData(`Resolving conditional clause (ternary)`, 'accent', true))

    const {outputRegister: testRegister, borrowed} = this.resolveExpression(test, {
        forceImmutableMerges: true
    })

    const testResult = borrowed ? this.getAvailableTempLoad() : testRegister
    const outputRegister = this.getAvailableTempLoad()
    this.chunk.append(new Opcode('TEST', testResult, testRegister))
    const jumpIP = this.chunk.getCurrentIP()
    const alternateJumpOpcode = new Opcode('JUMP_NOT_EQ', testResult, encodeDWORD(0))
    this.chunk.append(alternateJumpOpcode)

    if (borrowed) this.freeTempLoad(testResult)
    if (needsCleanup(test)) this.freeTempLoad(testRegister)

    const consequentResult = this.resolveExpression(consequent).outputRegister
    this.chunk.append(new Opcode('SET_REF', outputRegister, consequentResult))
    if (needsCleanup(consequent)) this.freeTempLoad(consequentResult)

    const endJumpIP = this.chunk.getCurrentIP()
    const endJumpOpcode = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
    this.chunk.append(endJumpOpcode)

    const alternateResult = this.resolveExpression(alternate).outputRegister
    this.chunk.append(new Opcode('SET_REF', outputRegister, alternateResult))
    if (needsCleanup(alternate)) this.freeTempLoad(alternateResult)

    const alternateJumpDistance = this.chunk.getCurrentIP() - jumpIP
    alternateJumpOpcode.modifyArgs(testResult, encodeDWORD(alternateJumpDistance))

    const endJumpDistance = this.chunk.getCurrentIP() - endJumpIP
    endJumpOpcode.modifyArgs(encodeDWORD(endJumpDistance))

    return outputRegister
}

module.exports = resolveConditionalExpression
