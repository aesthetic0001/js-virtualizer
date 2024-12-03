const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    for (let i = 0; i < 10; i++) {
        console.log(i)
    }

    let i = 0

    while (i < 10) {
        console.log(i)
        i++
    }
}

evaluate()
