
const multiplier = 2;

// @virtualize
function evaluate(a, b) {
    return (a + b * ((a + b) * (a - b + (a + b * (multiplier + a + b)))));
}

console.log(evaluate(1, 2));
