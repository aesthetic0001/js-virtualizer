const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    // const local1 = function () {
    //     return Math.random();
    // }
    function local2() {
        return Math.random();
    }

    console.log("Selected value2:", local2());
}

evaluate();
