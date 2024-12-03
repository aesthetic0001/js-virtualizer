const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    for (let i = 0; i < 10; i++) {
        console.log(i)
    }
}

evaluate()
