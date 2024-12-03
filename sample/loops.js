const JSVM = require("../src/vm");
const a = [1, 2, 3, 4, 5]

// @virtualize
function evaluate() {
    for (const i of a) {
        console.log("For of loop", i)
    }
    for (const i in a) {
        console.log("For in loop", i)
    }
    // for (let i = 0; i < 10; i++) {
    //     console.log("For loop", i)
    // }
    //
    // let i = 0
    //
    // while (i < 10) {
    //     console.log("While loop", i)
    //     i++
    // }
}

evaluate()
