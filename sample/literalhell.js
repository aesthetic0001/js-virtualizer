const JSVM = require("../src/vm");
const multiplier = 2;

// @virtualize
function evaluate() {
    return (1 + 2 + (3 + 4)) + (1 + 2 + (3 - 4));
}

console.log(evaluate());
