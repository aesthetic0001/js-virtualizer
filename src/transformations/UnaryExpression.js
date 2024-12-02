const {Opcode} = require("../utils/assembler");
const {unaryOperatorToOpcode, needsCleanup} = require("../utils/constants");

function resolveUnaryExpression(node) {
    const {argument, operator} = node;
    const opcode = unaryOperatorToOpcode(operator);
    const {outputRegister: argumentRegister, borrowed} = this.resolveExpression(argument)
    let mergeTo = borrowed ? this.getAvailableTempLoad() : argumentRegister
    this.chunk.append(new Opcode(opcode, mergeTo, argumentRegister));

    if (needsCleanup(argument)) this.freeTempLoad(argumentRegister)

    return mergeTo
}

module.exports = resolveUnaryExpression;
