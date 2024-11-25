const JSVM = require("../src/vm");
const multiplier = 2;

// @virtualize
function evaluate() {
    const object = {
        a: {
            c: 3,
            d: 4
        },
        b: 1,
        c: "2"
    }
    // const array = [1, "2"];
    console.log(object)
    return 1
}

console.log(evaluate());
