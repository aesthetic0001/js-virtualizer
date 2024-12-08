const JSVM = require('../src/vm');
function evaluate(a = 1, b = 1) {
    const VM = new JSVM();
    VM.loadFromString('eJxTv5puLypx1Q0ADUQC6w==', 'base64');
    VM.loadDependencies({
        63: b,
        103: a
    });
    VM.run();
    return VM.registers[24];
}
console.log(evaluate());