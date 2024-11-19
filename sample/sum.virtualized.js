const JSVM = require('../src/vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('0f42b80f5bd91a42425b0f5b051c42425b0feb4226', 'hex');
    VM.loadDependencies({
        5: multiplier,
        184: a,
        217: b
    });
    VM.run();
    return VM.registers[235];
}
console.log(sum(1, 2));