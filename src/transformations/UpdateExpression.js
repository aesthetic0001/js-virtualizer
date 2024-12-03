const {Opcode} = require("../utils/assembler");
const {needsCleanup, updateOperatorToOpcode} = require("../utils/constants");

function resolveUpdateExpression(node) {
    const {argument, operator} = node;
    const opcode = updateOperatorToOpcode(operator);
    const {outputRegister: argumentRegister} = this.resolveExpression(argument)
    this.chunk.append(new Opcode(opcode, argumentRegister));
    return argumentRegister
}

module.exports = resolveUpdateExpression;
