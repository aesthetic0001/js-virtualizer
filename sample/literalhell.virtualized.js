const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('019d000000030173000000041a9d9d73017300000005019b000000061a73739b1a9d9d73017300000001019b000000021a73739b1a73739d0fde7326', 'hex');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[222];
}
console.log(evaluate());