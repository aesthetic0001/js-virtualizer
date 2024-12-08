const JSVM = require("../src/vm");

// @virtualize
function random(...args) {
    console.log(args)

    function proto(a, b = 3, ...args) {
        console.log(a, b, args)
    }

    proto(1, 2, 3, 4, 5)
    proto(1)
}

random(1, 2, 3, 4, 5)
