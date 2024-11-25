const {operatorToOpcode} = require("../utils/constants");
const {log} = require("../utils/log");
const {Opcode, BytecodeValue} = require("../utils/assembler");

function isNestedBinaryExpression(node) {
    return node.left.type === 'BinaryExpression' || node.right.type === 'BinaryExpression'
}

function resolveBinaryExpression(node) {
    const {left, right, operator} = node;
    const opcode = operatorToOpcode(operator);

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
        switch (left.type) {
            case 'Literal': {
                const reg = this.getAvailableTempLoad()
                finalL = reg
                const valueLeft = new BytecodeValue(left.value, reg);
                this.chunk.append(valueLeft.getLoadOpcode());
                log(`Loaded literal left: ${left.value} into ${this.TLMap[reg]}`)
                break;
            }
            case 'Identifier': {
                finalL = this.getVariable(left.name);
                leftIsImmutable = true
                log(`Loaded variable left: ${left.name} at register ${finalL}`)
                break;
            }
            case 'MemberExpression': {
                finalL = this.resolveMemberExpression(left)
                break
            }
            case 'BinaryExpression': {
                finalL = this.resolveBinaryExpression(left);
                break;
            }
            case 'CallExpression': {
                finalL = this.resolveCallExpression(left)
                break
            }
        }
    }

    if (!finalR) {
        switch (right.type) {
            case 'Literal': {
                const reg = this.getAvailableTempLoad()
                finalR = reg
                const valueRight = new BytecodeValue(right.value, reg);
                this.chunk.append(valueRight.getLoadOpcode());
                log(`Loaded literal right: ${right.value} into ${this.TLMap[reg]}`)
                break;
            }
            case 'Identifier': {
                finalR = this.getVariable(right.name);
                rightIsImmutable = true
                log(`Loaded variable right: ${right.name} at register ${finalR}`)
                break
            }
            case 'MemberExpression': {
                finalR = this.resolveMemberExpression(right)
                break
            }
            case 'BinaryExpression': {
                finalR = this.resolveBinaryExpression(right);
                break;
            }
            case 'CallExpression': {
                finalR = this.resolveCallExpression(right)
                break
            }
        }
    }

    // always merge to the left
    const mergeTo = (leftIsImmutable) ? (rightIsImmutable ? this.getAvailableTempLoad() : finalR) : finalL
    this.chunk.append(new Opcode(opcode, mergeTo, finalL, finalR));
    const leftTL = this.TLMap[finalL]
    const rightTL = this.TLMap[finalR]
    const mergedTL = this.TLMap[mergeTo]

    if (leftTL && leftTL !== mergedTL) {
        this.freeTempLoad(finalL)
        log(`BinaryExpression resolver: ${leftTL}`)
    }

    if (rightTL && rightTL !== mergedTL) {
        this.freeTempLoad(finalR)
        log(`BinaryExpression resolver: ${rightTL}`)
    }

    log(`Evaluated BinaryExpression: ${left.type} ${operator} ${right.type} to ${mergedTL}`)

    return mergeTo
}

module.exports = resolveBinaryExpression;
