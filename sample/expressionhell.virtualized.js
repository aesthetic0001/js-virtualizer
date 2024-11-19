const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('1a6481a41b6464811a9681a41c96a4961a6464961c9681a41a961c961a9081a41a9696901c6464960f586426', 'hex');
    VM.loadDependencies({
        28: multiplier,
        129: a,
        164: b
    });
    VM.run();
    return VM.registers[88];
}
console.log(evaluate(1, 2));