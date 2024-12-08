const {log, LogData} = require("../utils/log");
const {Opcode, encodeDWORD} = require("../utils/assembler");
const assert = require("node:assert");

// VOID result, all registers are cleaned up before returning
function resolveTryStatement(node) {
    const {block, handler, finalizer} = node;

    log(new LogData(`Resolving try statement`, 'accent', true))

    const startIP = this.chunk.getCurrentIP()
    const errorRegister = this.getAvailableTempLoad()
    const catchOpcode = new Opcode('TRY_CATCH_FINALLY', errorRegister, encodeDWORD(0), encodeDWORD(0))

    this.chunk.append(catchOpcode)
    this.handleNode(block)
    this.chunk.append(new Opcode('END'))
    if (handler.param) assert(handler.param.type === 'Identifier', 'Catch block must have an identifier as a parameter')
    this.declareVariable(handler.param.name, errorRegister)
    const catchIP = this.chunk.getCurrentIP()
    this.handleNode(handler.body)
    this.chunk.append(new Opcode('END'))
    const finallyIP = this.chunk.getCurrentIP()
    if (finalizer) this.handleNode(finalizer)
    this.chunk.append(new Opcode('END'))

    catchOpcode.modifyArgs(errorRegister, encodeDWORD(catchIP - startIP), encodeDWORD(finallyIP - startIP))

    this.freeTempLoad(errorRegister)
}

module.exports = resolveTryStatement
