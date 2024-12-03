const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveIfStatement(node) {
    const {test, consequent, alternate} = node;

    log(new LogData(`Resolving if statement`, 'accent', true))

    const {outputRegister: testRegister, borrowed} = this.resolveExpression(test)

    const testResult = borrowed ? this.getAvailableTempLoad() : testRegister
    this.chunk.append(new Opcode('TEST', testResult, testRegister))
    const jumpIP = this.chunk.getCurrentIP()
    const alternateJumpOpcode = new Opcode('JUMP_NOT_EQ', testResult, encodeDWORD(0))
    this.chunk.append(alternateJumpOpcode)

    if (needsCleanup(test)) this.freeTempLoad(testRegister)

    this.handleNode(consequent)

    if (alternate) {
        const endJumpIP = this.chunk.getCurrentIP()
        const endJumpOpcode = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
        this.chunk.append(endJumpOpcode)
        const alternateJumpDistance = this.chunk.getCurrentIP() - jumpIP
        alternateJumpOpcode.modifyArgs(testResult, encodeDWORD(alternateJumpDistance))
        log(new LogData(`Detected alternate clause, setting alternate jump to: ${alternateJumpDistance}`, 'accent', true))
        this.handleNode(alternate)
        const endJumpDistance = this.chunk.getCurrentIP() - endJumpIP
        log(new LogData(`Generated alternate clause, jumping to end: ${endJumpDistance}`, 'accent', true))
        endJumpOpcode.modifyArgs(encodeDWORD(endJumpDistance))
    } else {
        log('No alternate!')
        log(new LogData(`End of if statement without consequent, jumping to end: ${this.chunk.getCurrentIP() - jumpIP}`, 'accent', true))
        alternateJumpOpcode.modifyArgs(testResult, encodeDWORD(this.chunk.getCurrentIP() - jumpIP))
    }
}

module.exports = resolveIfStatement
