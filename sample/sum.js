const JSVM = require("../src/vm");
const multiplier = 2;

// @virtualize
function sum(a, b) {
  return (a + b) * (multiplier + 2)
}

console.log(sum(1, 2));