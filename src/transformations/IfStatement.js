const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveIfStatement(node) {
    const {test, consequent, alternate} = node;

    log(new LogData(`Resolving if statement`, 'accent', true))

    let testRegister
    let testImmutable = false

    switch (test.type) {
        case 'Literal': {
            const literalValue = new BytecodeValue(test.value, this.getAvailableTempLoad());
            testRegister = literalValue.register
            this.chunk.append(literalValue.getLoadOpcode());
            break
        }
        case 'Identifier': {
            testRegister = this.getVariable(test.name)
            testImmutable = true
            break
        }
        case 'BinaryExpression': {
            testRegister = this.resolveBinaryExpression(test)
            break
        }
    }

    const testResult = testImmutable ? this.getAvailableTempLoad() : testRegister
    this.chunk.append(new Opcode('TEST', testResult, testRegister))
    const jumpIP = this.chunk.getCurrentIP()
    const alternateJumpOpcode = new Opcode('JUMP_NOT_EQ', testResult, encodeDWORD(0))
    this.chunk.append(alternateJumpOpcode)

    if (testImmutable) this.freeTempLoad(testRegister)
    if (needsCleanup(test)) this.freeTempLoad(testRegister)

    this.generate(consequent.body)

    if (alternate) {
        const endJumpIP = this.chunk.getCurrentIP()
        const endJumpOpcode = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
        this.chunk.append(endJumpOpcode)
        const alternateJumpDistance = this.chunk.getCurrentIP() - jumpIP
        alternateJumpOpcode.modifyArgs(testResult, encodeDWORD(alternateJumpDistance))
        log(new LogData(`Jumping to beginning of alternate: ${alternateJumpDistance} bytes`, 'accent', true))
        this.generate(alternate.body)
        const endJumpDistance = this.chunk.getCurrentIP() - endJumpIP
        log(new LogData(`End of conditional clause, jumping to end: ${endJumpDistance}`, 'accent', true))
        endJumpOpcode.modifyArgs(encodeDWORD(endJumpDistance))
    } else {
        log(new LogData(`End of if statement without consequent, jumping to end: ${this.chunk.getCurrentIP() - jumpIP}`, 'accent', true))
        alternateJumpOpcode.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - jumpIP))
    }
}

module.exports = resolveIfStatement
