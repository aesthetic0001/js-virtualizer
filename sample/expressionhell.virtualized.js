const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('GpZabhqWlmUclmWWGpZulhuRbmUakZGWGpZuZRyWlpEclmWWGpZulg+tliY=', 'base64');
    VM.loadDependencies({
        90: multiplier,
        101: b,
        110: a
    });
    VM.run();
    return VM.registers[173];
}
console.log(evaluate(1, 2));