const JSVM = require("../src/vm");

// @virtualize
function evaluate() {
    try {
        throw new Error("This is an error")
    } catch (e) {
        console.log("Caught an exception:", e)
    } finally {
        console.log("Finally block executed")
    }
}

evaluate()
