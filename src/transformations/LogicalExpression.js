const {logicalOperatorToOpcode} = require("../utils/constants");
const {log} = require("../utils/log");
const {Opcode} = require("../utils/assembler");

function isNestedLogicalExpression(node) {
    return node.left.type === 'LogicalExpression' || node.right.type === 'LogicalExpression'
}

// ALWAYS produces a mutable result, ownership is transferred to the caller
function resolveLogicalExpression(node, forceImmutableMerges) {
    const {left, right, operator} = node;
    const opcode = logicalOperatorToOpcode(operator);

    let finalL, finalR
    let leftIsImmutable = false, rightIsImmutable = false

    log(`Evaluating LogicalExpression: ${left.type} ${operator} ${right.type}`)

    // dfs down before evaluating
    if (left.type === 'LogicalExpression' && isNestedLogicalExpression(left)) {
        finalL = this.resolveLogicalExpression(left);
        log(`Result left is at ${this.TLMap[finalL]}`)
    }

    if (right.type === 'LogicalExpression' && isNestedLogicalExpression(right)) {
        finalR = this.resolveLogicalExpression(right);
        log(`Result right is at ${this.TLMap[finalR]}`)
    }

    if (!finalL) {
        const {outputRegister, borrowed} = this.resolveExpression(left);
        finalL = outputRegister
        leftIsImmutable = borrowed
        log(`Left is at ${this.TLMap[finalL]}`)
    }

    if (!finalR) {
        const {outputRegister, borrowed} = this.resolveExpression(right);
        finalR = outputRegister
        rightIsImmutable = borrowed
        log(`Right is at ${this.TLMap[finalR]}`)
    }

    // always merge to the left
    const mergeTo = forceImmutableMerges ? this.getAvailableTempLoad() : ((leftIsImmutable) ? (rightIsImmutable ? this.getAvailableTempLoad() : finalR) : finalL)
    this.chunk.append(new Opcode(opcode, mergeTo, finalL, finalR));
    const leftTL = this.TLMap[finalL]
    const rightTL = this.TLMap[finalR]
    const mergedTL = this.TLMap[mergeTo]

    if (leftTL && leftTL !== mergedTL && !leftIsImmutable) {
        this.freeTempLoad(finalL)
        log(`LogicalExpression resolver: ${leftTL}`)
    }

    if (rightTL && rightTL !== mergedTL && !rightIsImmutable) {
        this.freeTempLoad(finalR)
        log(`LogicalExpression resolver: ${rightTL}`)
    }

    log(`Evaluated LogicalExpression: ${left.type} ${operator} ${right.type} to ${mergedTL}`)

    return mergeTo
}

module.exports = resolveLogicalExpression;
