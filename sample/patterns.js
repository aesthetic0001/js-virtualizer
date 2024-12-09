const JSVM = require("../src/vm_dev");

// @virtualize
function evaluate() {
    const arr = [1, 2, 3, 4]
    const [a, b] = arr
    console.log(a, b)

    const obj = { c: 3, d: 4 }
    const { c, d } = obj
    console.log(c, d)
}

evaluate()
