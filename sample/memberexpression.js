const JSVM = require("../src/vm");
const object = {
    a: 1,
    b: 2,
    c: 3
};

// @virtualize
function evaluate() {
    return object["a"] + object.b + object[""+"c"];
}

console.log(evaluate());
