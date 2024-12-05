const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    const value1 = true ? Math.random() : 0.5
    console.log("Selected value:", value1)
    const value2 = false ? value1 : Math.random()
    console.log("Selected value:", value2)

    const output = value1 + value2 > 1.5 ? "Greater than 1.5" : "Less than or equal to 1.5"
    console.log(output)
}

evaluate()
