const JSVM = require("../src/vm_dev");

class Example {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.secret = Math.random();
        console.log('Secret');
        console.log(this.secret);
    }

    call() {
        console.log('External Call');
        return this.a + this.b + this.secret;
    }
}

// @virtualize
function evaluate() {
    const a = new Example(1, 2);
    return a.call();
}

console.log(evaluate());
