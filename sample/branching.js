const JSVM = require("../src/vm_dev");

// @virtualize
function evaluate() {
    const value = Math.random()
    console.log("Selected value:", value)
    if (value > 0.7) {
        console.log("Value is greater than 0.7")
        return 1
    } else if (value > 0.5) {
        console.log("Value is greater than 0.5")
        return 2
    } else {
        console.log("Value is less than or equal to 0.5")
        return 3
    }
}

console.log(evaluate());
