const {Opcode, encodeDWORD, encodeArrayRegisters} = require("../utils/assembler");
const {log, LogData} = require("../utils/log");

// always returns a MUTABLE register, ownership is transferred to the caller
function resolveFunctionDeclaration(node, options) {
    options = options || {}
    options.declareName = options.declareName ?? `anonymous_${this.generateOpcodeLabel()}`
    options.declareRegister = options.declareRegister ?? this.randomRegister()

    if (options.declareName) {
        log(new LogData(`Declaring function ${options.declareName} at register ${options.declareRegister}`, 'accent', true))
        this.declareVariable(options.declareName, options.declareRegister)
    } else {
        log(new LogData(`Declaring anonymous function at register ${options.declareRegister}`, 'accent', true))
    }

    const {params, body} = node;
    const label = this.generateOpcodeLabel()
    const outputRegister = this.getAvailableTempLoad()
    const argMap = []
    const dependencies = []

    const jumpOverIP = this.chunk.getCurrentIP()
    const jumpOver = new Opcode('JUMP_UNCONDITIONAL', encodeDWORD(0))
    this.chunk.append(jumpOver)
    for (const param of params) {
        this.declareVariable(param.name);
        argMap.push(this.getVariable(param.name))
    }
    this.enterVFuncContext(label)
    const startIP = this.chunk.getCurrentIP()
    this.handleNode(body)

    for (const register of this.vfuncReferences[this.vfuncReferences.length - 1]) {
        dependencies.push(register)
        this.deferDrop(register)
    }

    while (this.processStack.length) {
        const top = this.processStack[this.processStack.length - 1]
        if (top.label !== label) {
            break
        }
        const {type, computedOutput} = top.metadata
        switch (type) {
            case 'vfunc_return': {
                log(new LogData(`Detected vfunc return at ${computedOutput}!`, 'accent', true))
                top.modifyArgs(outputRegister, computedOutput)
                break
            }
            default: {
                throw new Error(`Unknown vfunc process: ${type}`)
            }
        }
        this.processStack.pop()
    }
    // if it did not return before this point, we need to return nothing
    this.chunk.append(new Opcode('SET_UNDEFINED', outputRegister))
    this.chunk.append(new Opcode('END'))
    this.exitVFuncContext()
    jumpOver.modifyArgs(encodeDWORD(this.chunk.getCurrentIP() - jumpOverIP))
    this.chunk.append(new Opcode('VFUNC_SETUP_CALLBACK', encodeDWORD(startIP - this.chunk.getCurrentIP()),
        options.declareRegister, outputRegister, encodeArrayRegisters(argMap), encodeArrayRegisters(dependencies)))
    this.freeTempLoad(outputRegister)

    return {
        outputRegister: options.declareRegister,
        dependencies,
        name: options.declareName
    }
}

module.exports = resolveFunctionDeclaration
