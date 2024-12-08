const {Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// VOID result, all registers are cleaned up before returning
function resolveThrowStatement(expression) {
    const argument = this.resolveExpression(expression.argument).outputRegister
    this.chunk.append(new Opcode('THROW_ARGUMENT', argument))
    if (needsCleanup(expression.argument)) this.freeTempLoad(argument)
}

module.exports = resolveThrowStatement;
