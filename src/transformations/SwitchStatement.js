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

    let previousJumpNEQ = null

    for (const caseBlock of cases) {
        const {test, consequent} = caseBlock
        const startIP = this.chunk.getCurrentIP()
        if (previousJumpNEQ) {
            previousJumpNEQ.modifyArgs(discriminantRegister, encodeDWORD(this.chunk.getCurrentIP() - startIP))
            previousJumpNEQ = null
        }
        if (test) {
            const {outputRegister: equalTo, borrowed} = this.resolveExpression(test, {
                forceImmutableMerges: true
            })
            this.chunk.append(new Opcode('EQ', testResultRegister, discriminantRegister, equalTo))
            if (borrowed) this.freeTempLoad(equalTo)
            const jumpNEQ = new Opcode('JUMP_NOT_EQ', testResultRegister, encodeDWORD(0))
            this.chunk.append(jumpNEQ)
            previousJumpNEQ = jumpNEQ
        }
        this.handleNode(consequent)
    }
}

module.exports = resolveSwitchStatement
