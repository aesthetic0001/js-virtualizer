const JSVM = require("../src/vm");
const a = [1, 3, 5, 7, 9]

// @virtualize
function evaluate() {
    for (const i of a) {
        // if (i === 3) {
        //     console.log("Skipping 3")
        //     continue
        // }
        if (i === 7) {
            console.log("Breaking at 7")
            break
        }
        console.log("For of loop", i)
    }
    // let
}

evaluate()
