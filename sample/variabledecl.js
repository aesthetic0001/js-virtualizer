const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    let a = 1;
    let b = 2;
    return a + b;
}

console.log(evaluate());
