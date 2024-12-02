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
    const ifJumpOpcode = new Opcode('JUMP_NOT_EQ', testResult, 0)
    this.chunk.append(ifJumpOpcode)

    if (testImmutable) this.freeTempLoad(testRegister)
    if (needsCleanup(test)) this.freeTempLoad(testRegister)

    this.generate(consequent.body)

    if (alternate) {
        const endJumpIP = this.chunk.getCurrentIP()
        const endJumpOpcode = new Opcode('JUMP_UNCONDITIONAL', 0)
        this.chunk.append(endJumpOpcode)
        log(new LogData(`Jumping to beginning of alternate: ${this.chunk.getCurrentIP() - jumpIP}`, 'accent', true))
        ifJumpOpcode.modifyArgs(testResult, encodeDWORD(this.chunk.getCurrentIP() - jumpIP))
        this.generate(alternate.body)
        log(new LogData(`End of if statement, jumping to end: ${this.chunk.getCurrentIP() - endJumpIP}`, 'accent', true))
        endJumpOpcode.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - endJumpIP))
    } else {
        log(new LogData(`End of if statement without consequent, jumping to end: ${this.chunk.getCurrentIP() - jumpIP}`, 'accent', true))
        ifJumpOpcode.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - jumpIP))
    }
}

module.exports = resolveIfStatement
