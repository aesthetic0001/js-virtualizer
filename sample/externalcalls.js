const JSVM = require("../src/vm");

const object = {
    call: function(a, b) {
        console.log('External Call')
        return a + b
    }
}

// @virtualize
function evaluate() {
    console.log('Internal Call')
    console.log("1 + 2 = " + (1 + 2));
    const result = object.call(3, 5);
    console.log("Result of external call: " + result);
    return result + 1
}

console.log(evaluate());
