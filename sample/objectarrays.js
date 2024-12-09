const JSVM = require("../src/vm_dev");
const multiplier = 2;

// @virtualize
function evaluate() {
    const object = {
        a: {
            c: 3,
            d: 4
        },
        b: 1,
        c: "2",
        d: [1, 2, 3]
    }
    const array = [1, "2", {a: 3}, [1, 2, 3]]
    console.log(object)
    console.log(array)
    return 1
}

console.log(evaluate());
