const JSVM = require('../src/vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('1a0bb75f01e1000000021ae14ae11c0b0be10f600b26', 'hex');
    VM.loadDependencies({
        74: multiplier,
        95: b,
        183: a
    });
    VM.run();
    return VM.registers[96];
}
console.log(sum(1, 2));