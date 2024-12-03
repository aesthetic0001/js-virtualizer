const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    for (let i = 0; i < 10; i++) {
        console.log("For loop", i)
    }

    let i = 0

    while (i < 10) {
        console.log("While loop", i)
        i++
    }
}

evaluate()
