const {BytecodeValue} = require("../utils/assembler");
const {log, LogData} = require("../utils/log");
const {registers} = require("../utils/constants");

// Produces a result that may be mutable or immutable, depending on the expression that was resolved
// Ownership is explicitly stated in the "borrowed" field of the return object
function resolveExpression(expression, options) {
    if (!expression) {
        log(new LogData(`Expression is null! Using undefined register as output`, 'warn', true))
        return {
            outputRegister: registers.UNDEFINED,
            borrowed: false,
            metadata: {}
        }
    }
    let outputRegister, borrowed = false
    options = options ?? {}
    options.computed = options.computed ?? true
    options.forceObjectImmutability = options.forceObjectImmutability ?? false
    options.forceImmutableMerges = options.forceImmutableMerges ?? true
    options.awaited = options.awaited ?? false

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
                log(new LogData(`Treating non-computed identifier as literal! Loading "${expression.name}" at register ${outputRegister}`, 'warn', true))
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
            const resolved = this.resolveMemberExpression(expression, options.forceObjectImmutability, options.forceImmutableMerges);
            outputRegister = resolved.outputRegister
            metadata.objectRegister = resolved.objectRegister
            log(`MemberExpression result is at ${this.TLMap[outputRegister]}`)
            break;
        }
        case 'BinaryExpression': {
            outputRegister = this.resolveBinaryExpression(expression, options.forceImmutableMerges);
            log(`BinaryExpression result is at ${this.TLMap[outputRegister]}`)
            break;
        }
        case 'CallExpression': {
            outputRegister = this.resolveCallExpression(expression, options.awaited);
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
        case 'NewExpression': {
            outputRegister = this.resolveNewExpression(expression);
            log(`NewExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'UnaryExpression': {
            outputRegister = this.resolveUnaryExpression(expression, options.forceImmutableMerges);
            log(`UnaryExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'UpdateExpression': {
            outputRegister = this.resolveUpdateExpression(expression);
            log(`UpdateExpression result is at ${outputRegister}`)
            break
        }
        case 'LogicalExpression': {
            outputRegister = this.resolveLogicalExpression(expression, options.forceImmutableMerges);
            log(`LogicalExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'ConditionalExpression': {
            outputRegister = this.resolveConditionalExpression(expression);
            log(`ConditionalExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'FunctionDeclaration':
        case 'ArrowFunctionExpression': {
            outputRegister = this.resolveFunctionDeclaration(expression).outputRegister
            log(`ArrowFunctionExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'TemplateLiteral': {
            outputRegister = this.resolveTemplateLiteral(expression)
            log(`TemplateLiteral result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'SpreadElement': {
            outputRegister = this.resolveSpreadElement(expression)
            log(`SpreadElement result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'AssignmentPattern': {
            // has no output register, only side effects
            this.resolveAssignmentPattern(expression)
            break
        }
        case 'AwaitExpression': {
            const res = this.resolveAwaitExpression(expression)
            outputRegister = res.outputRegister
            borrowed = res.borrowed
            log(`AwaitExpression result is at ${this.TLMap[outputRegister]}`)
            break
        }
        case 'SequenceExpression': {
            const res = this.resolveSequenceExpression(expression)
            outputRegister = res.outputRegister
            borrowed = res.borrowed
            log(`SequenceExpression result is at ${outputRegister}`)
            break
        }
        case 'AssignmentExpression': {
            outputRegister = this.resolveAssignmentExpression(expression)
            log(`AssignmentExpression result is at ${outputRegister}`)
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
