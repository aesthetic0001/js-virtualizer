const {log, LogData} = require("../utils/log");
const {encodeDWORD, Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// VOID result, all registers are cleaned up before returning
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

    this.chunk.append(new Opcode('TEST', testResult, testRegister))
    // this will exit the loop if the test fails
    const endJumpIP = this.chunk.getCurrentIP()
    const endJump = new Opcode('JUMP_NOT_EQ', testResult, encodeDWORD(0))
    this.chunk.append(endJump)

    this.enterContext('loops', label)

    this.handleNode(node.body)

    const continueGoto = this.chunk.getCurrentIP()
    this.handleNode(update)

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
                log(new LogData(`Detected break statement at ${ip}, jumping to end of loop`, 'accent', true))
                top.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - ip))
                break
            }
            case 'continue': {
                log(new LogData(`Detected continue statement at ${ip}, jumping to start of loop`, 'accent', true))
                top.modifyArgs(encodeDWORD(continueGoto - ip))
                break
            }
            default: {
                throw new Error(`Unknown loop control type: ${type}`)
            }
        }
        processStack.pop()
    }

    if (borrowed) this.freeTempLoad(testResult)
    if (needsCleanup(test)) this.freeTempLoad(testRegister)
    this.exitContext('loops')
}

module.exports = resolveForStatement
