const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    // const local1 = function () {
    //     return Math.random();
    // }
    function local2() {
        return Math.random();
    }

    // const value = local1();
    // console.log("Selected value:", value);
    const value2 = local2();
    console.log("Selected value2:", value2);

    // console.log("Sum: ", value + value2);
}

evaluate();
