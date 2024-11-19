const JSVM = require('../src/vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('1a5b30690170000000021a7077701c5b5b700f805b26', 'hex');
    VM.loadDependencies({
        48: a,
        105: b,
        119: multiplier
    });
    VM.run();
    return VM.registers[128];
}
console.log(sum(1, 2));