const {log, LogData} = require("../utils/log");
const {encodeDWORD, Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// VOID result, all registers are cleaned up before returningfor
function resolveWhileStatement(node) {
    const {test, body} = node;
    const label = this.generateOpcodeLabel()

    log(new LogData(`Resolving while loop`, 'accent', true))

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
    this.enterContext('loops', label)
    this.handleNode(body)
    const continueGoto = this.chunk.getCurrentIP()
    this.chunk.append(new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(startIP - this.chunk.getCurrentIP())))
    endJump.modifyArgs(testResult, encodeDWORD(this.chunk.getCurrentIP() - endJumpIP))

    const processStack = this.getProcessStack('loops')

    while (processStack.length) {
        const top = processStack[processStack.length - 1]
        if (top.label !== label) {
            break
        }
        const {type, ip} = top.metadata
        switch (type) {
            case 'break': {
                log(new LogData(`Detected break statement at ${ip}, jumping to end of for of loop`, 'accent', true))
                top.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - ip))
                break
            }
            case 'continue': {
                log(new LogData(`Detected continue statement at ${ip}, jumping to start of for of loop`, 'accent', true))
                top.modifyArgs(encodeDWORD(continueGoto - ip))
                break
            }
        }
        processStack.pop()
    }

    if (borrowed) this.freeTempLoad(testResult)
    if (needsCleanup(test)) this.freeTempLoad(testRegister)
    this.exitContext('loops')
}

module.exports = resolveWhileStatement
