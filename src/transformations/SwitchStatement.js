const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// VOID result, all registers are cleaned up before returning
function resolveSwitchStatement(node) {
    const {discriminant, cases} = node;
    const label = this.generateOpcodeLabel()

    log(new LogData(`Resolving switch statement`, 'accent', true))

    const {outputRegister: discriminantRegister, borrowed} = this.resolveExpression(discriminant, {
        forceImmutableMerges: true
    })

    const testResultRegister = this.getAvailableTempLoad()

    this.enterContext('switch', label)

    let previousJumpUnconditional = null
    let previousJumpUnconditionalIP = null

    let defaultCase = null

    for (const caseBlock of cases) {
        const {test, consequent} = caseBlock
        if (test === null) {
            defaultCase = caseBlock
            continue
        }
        const startIP = this.chunk.getCurrentIP()
        const {outputRegister: equalTo, borrowed} = this.resolveExpression(test, {
            forceImmutableMerges: true
        })
        this.chunk.append(new Opcode('EQ', testResultRegister, discriminantRegister, equalTo))
        if (needsCleanup(test) && !borrowed) this.freeTempLoad(equalTo)
        const jumpNEQIP = this.chunk.getCurrentIP()
        const jumpNEQ = new Opcode('JUMP_NOT_EQ', testResultRegister, encodeDWORD(0))
        this.chunk.append(jumpNEQ)
        if (previousJumpUnconditional) {
            previousJumpUnconditional.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - previousJumpUnconditionalIP))
            previousJumpUnconditional = null
            previousJumpUnconditionalIP = null
        }
        this.generate(consequent)
        // no break encountered: jump to the beginning of the next clause
        previousJumpUnconditionalIP = this.chunk.getCurrentIP()
        const jumpUnconditional = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
        previousJumpUnconditional = jumpUnconditional
        this.chunk.append(jumpUnconditional)
        jumpNEQ.modifyArgs(testResultRegister, encodeDWORD(this.chunk.getCurrentIP() - jumpNEQIP))
    }

    // default always goes to the end of the switch statement regardless of its position in the consequent array
    if (defaultCase) {
        const startIP = this.chunk.getCurrentIP()
        if (previousJumpUnconditional) {
            previousJumpUnconditional.modifyArgs(encodeDWORD(startIP - previousJumpUnconditionalIP))
            previousJumpUnconditional = null
            previousJumpUnconditionalIP = null
        }
        this.generate(defaultCase.consequent)
    }

    if (previousJumpUnconditional) previousJumpUnconditional.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - previousJumpUnconditionalIP))

    const processStack = this.getProcessStack('switch')

    while (processStack.length) {
        const top = processStack[processStack.length - 1]
        if (top.label !== label) {
            break
        }
        const {type, ip} = top.metadata
        switch (type) {
            case 'break': {
                log(new LogData(`Detected break statement at ${ip}, jumping to end of switch statement`, 'accent', true))
                top.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - ip))
                break
            }
        }
        processStack.pop()
    }


    this.exitContext('switch')

    if (needsCleanup(discriminant) && !borrowed) this.freeTempLoad(discriminantRegister)
    this.freeTempLoad(testResultRegister)
}

module.exports = resolveSwitchStatement
