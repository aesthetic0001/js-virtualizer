const JSVM = require("../src/vm");

const object = {
    call: function(a, b) {
        console.log('External call');
        return a + b
    }
}

// @virtualize
function evaluate() {
    return object.call(2, 3);
}

console.log(evaluate());
