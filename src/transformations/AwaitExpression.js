function resolveAwaitExpression(expression) {
    const {outputRegister, borrowed} = this.resolveExpression(expression.argument, {
        awaited: true
    })
    
    return {
        outputRegister,
        borrowed
    }
}

module.exports = resolveAwaitExpression;
