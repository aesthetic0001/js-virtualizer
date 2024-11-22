const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    let a = 1;
    let b = 2;
    a += 3
    b = 4
    console.log('Hello from the VM! ' + a + b)
    return a + b;
}

console.log(evaluate());
