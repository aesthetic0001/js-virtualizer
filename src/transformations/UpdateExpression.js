const {Opcode} = require("../utils/assembler");
const {needsCleanup, updateOperatorToOpcode} = require("../utils/constants");

// ALWAYS produces a mutable result, ownership is transferred to the caller
function resolveUpdateExpression(node) {
    const {argument, operator} = node;
    const opcode = updateOperatorToOpcode(operator);
    const {outputRegister: argumentRegister} = this.resolveExpression(argument)
    this.chunk.append(new Opcode(opcode, argumentRegister));
    return argumentRegister
}

module.exports = resolveUpdateExpression;
