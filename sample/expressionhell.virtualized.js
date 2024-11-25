const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJyTc277LOfsXKjgXOgs5/zZWX7K50K5KVNA7EIFZ+cpMHEhbWctAGxlD5U=', 'base64');
    VM.loadDependencies({
        113: b,
        134: multiplier,
        243: a
    });
    VM.run();
    return VM.registers[43];
}
console.log(evaluate(1, 2));