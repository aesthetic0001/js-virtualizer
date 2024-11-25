const JSVM = require("../src/vm");

// @virtualize
function random() {
    return Math.random().toString(36).substring(2, 7)
}

console.log(random())
