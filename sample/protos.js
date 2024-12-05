const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    // const local1 = function () {
    //     return Math.random();
    // }
    let a = 0
    function local2() {
        a+=1
        return Math.random();
    }

    console.log("Selected value2:", local2());
    console.log("A value:", a);
}

evaluate();
