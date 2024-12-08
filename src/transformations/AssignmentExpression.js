const {log} = require("../utils/log");
const {Opcode} = require("../utils/assembler");
const {binaryOperatorToOpcode, needsCleanup} = require("../utils/constants");

// ALWAYS produces a copy of result, ownership of the copy is passed to the caller
function resolveAssignmentExpression(node) {
    const {left, right, operator} = node;
    const leftRegister = this.resolveExpression(left).outputRegister
    let rightRegister
    if (left.type === 'Identifier') {
        const name = left.name
        if (this.activeVFunctions[name]) {

        }
        switch (right.type) {
            case 'ArrowFunctionExpression':
            case 'FunctionDeclaration': {
                this.resolveFunctionDeclaration(right, {
                    declareName: name
                })
                rightRegister = this.getVariable(left.name)
                break
            }
        }
    }

    if (!rightRegister) rightRegister = this.resolveExpression(right).outputRegister

    switch (operator) {
        case '=': {
            log(`Evaluating regular assignment expression with SET_REF`)
            this.chunk.append(new Opcode('SET_REF', leftRegister, rightRegister));
            break;
        }
        default: {
            const opcode = binaryOperatorToOpcode(operator.slice(0, -1));
            log(`Evaluating inclusive assignment expression with ${operator} using ${opcode}`)
            this.chunk.append(new Opcode(opcode, leftRegister, leftRegister, rightRegister));
        }
    }

    const outputRegister = this.getAvailableTempLoad()
    this.chunk.append(new Opcode('SET_REF', outputRegister, leftRegister))

    if (needsCleanup(left)) this.freeTempLoad(leftRegister)
    if (needsCleanup(right)) this.freeTempLoad(rightRegister)

    return outputRegister
}

module.exports = resolveAssignmentExpression;
