const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    const value = Math.random()
    console.log("Selected value:", value)
    if (1 === 2) {
        return "Greater than 0.7"
    } else {
        return "Less than equal to 0.5"
    }
}

console.log(evaluate());
