const JSVM = require("../src/vm");
const multiplier = 2;

// @virtualize
function evaluate() {
    const object = {
        a: {},
        b: 1,
        c: "2"
    }
    const array = [1, "2"];
    console.log(object)
}

console.log(evaluate());
