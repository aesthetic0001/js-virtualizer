const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    // const local1 = function () {
    //     return Math.random();
    // }
    let a = 0
    function local2() {
        a+=1
        if (a >= 5) {
            return a
        }
        console.log(a)
    }

    for (let i = 0; i < 10; i++) {
        local2()
    }

    console.log('Done')
    console.log(a)
}

evaluate();
