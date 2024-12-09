class Pass {
    constructor(name, handler, priority) {
        this.name = name;
        this.handler = handler;
        this.priority = priority;
    }

    run(VMChunks, vmAST) {
        this.handler(VMChunks, vmAST);
    }

    toString() {
        return `Pass: ${this.name} (${this.priority})`
    }
}

Pass.prototype.valueOf = function() {
    return this.priority;
}

module.exports = Pass
