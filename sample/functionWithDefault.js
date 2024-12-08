const JSVM = require("../src/vm");

// @virtualize
function evaluate(a = 1, b = 1) {
    return a + b;
}

console.log(evaluate());
