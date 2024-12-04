const {Opcode, encodeDWORD, encodeArrayRegisters} = require("../utils/assembler");

// always returns a MUTABLE register which contains the
function resolveFunctionDeclaration(node) {
    const {id, params, body} = node;
    const label = this.generateOpcodeLabel()
    const functionResult = this.getVariable(id.name) ?? this.getAvailableTempLoad()
    const outputRegister = this.getAvailableTempLoad()
    const argMap = []
    const restoreRegisters = []
    const dependencies = []

    restoreRegisters.push(outputRegister)

    const jumpOver = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
    this.chunk.append(jumpOver)
    const startIP = this.chunk.getCurrentIP()

    for (const param of params) {
        this.declareVariable(param.name);
        argMap.push(this.getVariable(param.name))
    }

    this.enterContext('vfunc', label)
    this.handleNode(body)
    this.chunk.append(new Opcode('VFUNC_RETURN', outputRegister, encodeArrayRegisters(restoreRegisters)))
    jumpOver.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - startIP))
    this.exitContext('vfunc')

    this.chunk.append(new Opcode('VFUNC_SETUP_CALLBACK', encodeDWORD(startIP - this.chunk.getCurrentIP()), functionResult, outputRegister, encodeArrayRegisters(argMap)))

    if (!this.activeFunctions[functionResult]) {
        this.activeFunctions[functionResult] = []
    }

    // so we can drop dependencies after function is no longer active
    this.activeFunctions[functionResult].push({
        dependencies
    })

    this.freeTempLoad(outputRegister)
    return functionResult
}

module.exports = resolveFunctionDeclaration
