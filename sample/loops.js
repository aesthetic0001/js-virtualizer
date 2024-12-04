const JSVM = require("../src/vm");
const a = [1, 2, 3, 4, 5]

// @virtualize
function evaluate() {
    for (let i = 0; i<10;i++) {
        if (i === 3) {
            console.log("Skipping 3")
            continue
        }
        if (i === 5) {
            console.log("Breaking at 5")
            break
        }
        console.log("Generic for loop", i)
    }
    console.log('Done generic for loop')
    // for (const i in a) {
    //     console.log("For in loop", i)
    // }
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
