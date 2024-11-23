const JSVM = require("../src/vm");

const object = {
    call: function() {
        console.log('External call');
        return 3 + 3;
    }
}

// @virtualize
function evaluate() {
    return object.call();
}

console.log(evaluate());
