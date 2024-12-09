const JSVM = require("../src/vm_dev");
const multiplier = 2;

// @virtualize
function evaluate() {
    const a = {
        b: 2
    }
    const b = {
        ...a,
        ...{
            c: 3,
            a: 1,
            b: 4
        },
        ...{
            d: 5,
            b: 6
        }
    }
    console.log(b)
}

evaluate()
