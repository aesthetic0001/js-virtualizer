const {binaryOperatorToOpcode} = require("../utils/constants");
const {log} = require("../utils/log");
const {Opcode, BytecodeValue} = require("../utils/assembler");

function isNestedBinaryExpression(node) {
    return node.left.type === 'BinaryExpression' || node.right.type === 'BinaryExpression'
}

// ALWAYS produces a mutable result, ownership is transferred to the caller
function resolveBinaryExpression(node, forceImmutableMerges) {
    const {left, right, operator} = node;
    const opcode = binaryOperatorToOpcode(operator);

    let finalL, finalR
    let leftIsImmutable = false, rightIsImmutable = false

    log(`Evaluating BinaryExpression: ${left.type} ${operator} ${right.type}`)

    // dfs down before evaluating
    if (left.type === 'BinaryExpression' && isNestedBinaryExpression(left)) {
        finalL = this.resolveBinaryExpression(left);
        log(`Result left is at ${this.TLMap[finalL]}`)
    }

    if (right.type === 'BinaryExpression' && isNestedBinaryExpression(right)) {
        finalR = this.resolveBinaryExpression(right);
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
        log(`BinaryExpression resolver: ${leftTL}`)
    }

    if (rightTL && rightTL !== mergedTL && !rightIsImmutable) {
        this.freeTempLoad(finalR)
        log(`BinaryExpression resolver: ${rightTL}`)
    }

    log(`Evaluated BinaryExpression: ${left.type} ${operator} ${right.type} to ${mergedTL}`)

    return mergeTo
}

module.exports = resolveBinaryExpression;
