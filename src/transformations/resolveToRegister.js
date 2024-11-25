const {BytecodeValue} = require("../utils/assembler");
const {log, LogData} = require("../utils/log");

function resolveExpression(expression, computed = true) {
    let outputRegister, borrowed = false

    switch (expression.type) {
        case 'Identifier': {
            if (computed) {
                outputRegister = this.getVariable(expression.name);
                log(`Loaded property: ${expression.name} at register ${outputRegister}`)
                borrowed = true
            } else {
                log(new LogData('Treating non-computed identifier as literal', 'warn', false))
                const literalValue = new BytecodeValue(expression.name, this.getAvailableTempLoad());
                outputRegister = literalValue.register
                this.chunk.append(literalValue.getLoadOpcode());
            }
            break
        }
        case 'Literal': {
            const tempRegister = this.getAvailableTempLoad();
            const literalValue = new BytecodeValue(expression.value, tempRegister);
            this.chunk.append(literalValue.getLoadOpcode());
            outputRegister = literalValue.register
            break
        }
        case 'MemberExpression': {
            outputRegister = this.resolveMemberExpression(expression);
            break;
        }
        case 'BinaryExpression': {
            outputRegister = this.resolveBinaryExpression(expression);
            break;
        }
        case 'CallExpression': {
            outputRegister = this.resolveCallExpression(expression);
            break
        }
        case 'ObjectExpression': {
            outputRegister = this.resolveObjectExpression(expression);
            break
        }
        case 'ArrayExpression': {
            outputRegister = this.resolveArrayExpression(expression);
            break
        }
    }

    return {
        outputRegister,
        borrowed
    }
}

module.exports = resolveExpression
