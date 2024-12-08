const JSVM = require("../src/vm");

// @virtualize
function evaluate(a = 1, b = 1) {
    function protoWithDefault(c = 4, d = 5) {
        return c + d;
    }
    console.log(protoWithDefault());
    return a + b;
}

console.log(evaluate());
