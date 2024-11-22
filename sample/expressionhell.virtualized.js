const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('789c93eadc5c29d5d9c92fd3c9df29d559d9299d5dc92f959d0d62f3cb747666c3c4f9df74aa01005b870fc4', 'hex');
    VM.loadDependencies({
        15: b,
        121: a,
        179: multiplier
    });
    VM.run();
    return VM.registers[236];
}
console.log(evaluate(1, 2));