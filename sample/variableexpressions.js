const JSVM = require("../src/vm_dev");

// @virtualize
function evaluate() {
    let a = 1;
    let b = 2;
    a += 3
    b = 4
    return a + b;
}

console.log(evaluate());
