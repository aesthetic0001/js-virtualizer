const {needsCleanup} = require("../utils/constants");
const {log} = require("../utils/log");

// mutability depends on the final expression
function resolveSequenceExpression(expression) {
    const expressions = expression.expressions;
    let outputRegister = null;
    let borrowed = false;

    log(`Resolving sequence expression: ${expressions.map(e => e.type).join(', ')}`);

    for (let i = 0; i < expressions.length; i++) {
        log(`Sequence resolving: ${expressions[i].type}`);
        const expr = expressions[i];
        const res = this.resolveExpression(expr)
        outputRegister = res.outputRegister;
        borrowed = res.borrowed;
        if (i < expressions.length - 1 && needsCleanup(expr)) this.freeTempLoad(outputRegister);
    }

    return {outputRegister, borrowed};
}

module.exports = resolveSequenceExpression;
