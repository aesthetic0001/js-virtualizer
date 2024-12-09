const JSVM = require('../src/vm_dev');

// @virtualize
function evaluate(a) {
    switch (a) {
        case 1:
            console.log("a is 1")
            break
        case 2:
            console.log("a is 2")
            break
        default:
            console.log("a is neither 1 nor 2")
            break
    }
}

evaluate(1)
