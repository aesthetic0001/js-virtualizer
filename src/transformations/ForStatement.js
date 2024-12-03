const {log, LogData} = require("../utils/log");
const {encodeDWORD, Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveForStatement(node) {
    const {init, test, update} = node;
    const label = this.generateOpcodeLabel()

    log(new LogData(`Resolving generic for loop with label ${label}`, 'accent', true))

    this.handleNode(init)

    const startIP = this.chunk.getCurrentIP()

    const {outputRegister: testRegister, borrowed} = this.resolveExpression(test, {
        forceImmutableMerges: true
    })
    const testResult = borrowed ? this.getAvailableTempLoad() : testRegister

    this.enterContext('loops', label)

    this.chunk.append(new Opcode('TEST', testResult, testRegister))
    // this will exit the loop if the test fails
    const endJumpIP = this.chunk.getCurrentIP()
    const endJump = new Opcode('JUMP_NOT_EQ', testResult, encodeDWORD(0))
    this.chunk.append(endJump)

    this.handleNode(node.body, {
        label
    })

    this.handleNode(update)

    const jumpback = startIP - this.chunk.getCurrentIP()
    this.chunk.append(new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(jumpback)))

    const jumpout = this.chunk.getCurrentIP() - endJumpIP
    endJump.modifyArgs(testResult, encodeDWORD(jumpout))

    this.exitContext('loops')

    while (this.processStack.length) {
        const top = this.processStack[this.processStack.length - 1]
        if (top.label !== label) {
            break
        }
        switch (top.metadata.type) {
            case 'break': {
                top.modifyArgs(encodeDWORD(jumpout))
                break
            }
            case 'continue': {
                top.modifyArgs(encodeDWORD(jumpback))
                break
            }
        }
        this.processStack.pop()
    }

    if (borrowed) this.freeTempLoad(testResult)
    if (needsCleanup(test)) this.freeTempLoad(testRegister)
}

module.exports = resolveForStatement
