const {log} = require("../utils/log");
const {Opcode} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");
const assert = require("node:assert");

// produces no result, as the result is stored directly in the left-hand side
function resolveAssignmentPattern(node) {
    const {left, right} = node

    log(`Resolving assignment pattern: ${left.name} = ${right.value}`)

    // lhs should always be an identifier
    assert(left.type === 'Identifier', 'Left-hand side of assignment pattern is not an identifier')
    const leftRegister = this.resolveExpression(left).outputRegister
    const rightRegister = this.resolveExpression(right).outputRegister

    this.chunk.append(new Opcode('LOGICAL_NULLISH', leftRegister, leftRegister, rightRegister))

    if (needsCleanup(right)) this.freeTempLoad(rightRegister)
    return null
}

module.exports = resolveAssignmentPattern
