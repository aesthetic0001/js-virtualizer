const JSVM = require("../src/vm_dev");
const multiplier = 2;

// @virtualize
function evaluate() {
    return (1 + 2 * (3 + 4 + (5 * 6 + (7 + 8 * (9 + 10))))) + (1 + 2 + (3 / 4 + (5 / 6 + (7 + 8 / (9 + 10)))));
}

console.log(evaluate());
