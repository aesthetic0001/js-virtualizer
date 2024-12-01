const {BytecodeValue} = require("../utils/assembler");
const {log, LogData} = require("../utils/log");
const {registers} = require("../utils/constants");

function resolveExpression(expression, options) {
    let outputRegister, borrowed = false
    options = options ?? {}
    options.computed = options.computed ?? true
    options.forceObjectImmutability = options.forceObjectImmutability ?? false

    const metadata = {}
    const {computed} = options

    switch (expression.type) {
        case 'Identifier': {
            if (computed) {
                outputRegister = this.getVariable(expression.name);
                log(`Loaded identifier: ${expression.name} at register ${outputRegister}`)
                borrowed = true
            } else {
                const literalValue = new BytecodeValue(expression.name, this.getAvailableTempLoad());
                outputRegister = literalValue.register
                this.chunk.append(literalValue.getLoadOpcode());
                log(new LogData(`Treating non-computed identifier as literal! Loading "${expression.name}" at register ${outputRegister}`, 'warn', false))
            }
            break
        }
        case 'Literal': {
            const tempRegister = this.getAvailableTempLoad();
            const literalValue = new BytecodeValue(expression.value, tempRegister);
            this.chunk.append(literalValue.getLoadOpcode());
            outputRegister = literalValue.register
            log(`Loaded literal: ${expression.value} at register ${outputRegister}`)
            break
        }
        case 'MemberExpression': {
            const resolved = this.resolveMemberExpression(expression, options.forceObjectImmutability);
            outputRegister = resolved.outputRegister
            metadata.objectRegister = resolved.objectRegister
            log(`MemberExpression result is at ${this.TLMap[outputRegister]}`)
            break;
        }
        case 'BinaryExpression': {
            outputRegister = this.resolveBinaryExpression(expression);
            log(`BinaryExpression result is at ${this.TLMap[outputRegister]}`)
            break;
        }
        case 'CallExpression': {
            outputRegister = this.resolveCallExpression(expression);
            log(`CallExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'ObjectExpression': {
            outputRegister = this.resolveObjectExpression(expression);
            log(`ObjectExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'ArrayExpression': {
            outputRegister = this.resolveArrayExpression(expression);
            log(`ArrayExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
    }

    return {
        outputRegister,
        borrowed,
        metadata
    }
}

module.exports = resolveExpression
