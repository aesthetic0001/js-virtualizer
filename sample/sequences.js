const JSVM = require("../src/vm_dev");

// @virtualize
function evaluate() {
    let x = 1;

    x = (x++, x);

    console.log(x);

    x = (2, 3);

    console.log(x);

    let from = 0;
    let to = 10;
    let i = from

    let skipIf = function (value) {
        return i === value ? (i = to, true) : false;
    }
    for(; skipIf(3), i < to; i++) {
        console.log(i);
    }
}

evaluate()
