const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJyTayiMlGto2K3QsLtBriGyQX575G657dtB7N0KDQ3bYeJCGg1aAKLwEkk=', 'base64');
    VM.loadDependencies({
        89: a,
        113: multiplier,
        187: b
    });
    VM.run();
    return VM.registers[40];
}
console.log(evaluate(1, 2));