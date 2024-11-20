const JSVM = require('../src/vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('1abcdad00170000000021a70a2701cbcbc700f57bc26', 'hex');
    VM.loadDependencies({
        162: multiplier,
        208: b,
        218: a
    });
    VM.run();
    return VM.registers[87];
}
console.log(sum(1, 2));