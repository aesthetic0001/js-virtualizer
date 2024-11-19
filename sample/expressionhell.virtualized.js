const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('1ad65fd11bd6d65f1abc5fd11cbcd1bc1ad6d6bc1cbc5fd11abc20bc1ab85fd11abcbcb81cd6d6bc0f5ad626', 'hex');
    VM.loadDependencies({
        32: multiplier,
        95: a,
        209: b
    });
    VM.run();
    return VM.registers[90];
}
console.log(evaluate(1, 2));