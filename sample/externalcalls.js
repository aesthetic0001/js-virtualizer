const JSVM = require("../src/vm");

function call() {
    console.log("Outside call");
}

// @virtualize
function evaluate() {
    return call()
}

console.log(evaluate());
