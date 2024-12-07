const {log, LogData} = require("../utils/log");
const {Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// ALWAYS produces a mutable result, ownership is transferred to the caller
function resolveSpreadElement(node, spreadTo) {
    const {argument} = node

    spreadTo = spreadTo ?? null

    log(`Resolving spread element: ${argument.type}`)

    const {outputRegister: argumentRegister, borrowed} = this.resolveExpression(argument)
    const outputRegister = spreadTo ? spreadTo : (borrowed ? this.getAvailableTempLoad() : argumentRegister)

    if (spreadTo) {
        this.chunk.append(new Opcode('SPREAD_INTO', outputRegister, argumentRegister))
    } else {
        this.chunk.append(new Opcode('SPREAD', outputRegister, argumentRegister))
    }
    if (needsCleanup(argument)) this.freeTempLoad(argumentRegister)
    return outputRegister
}

module.exports = resolveSpreadElement
