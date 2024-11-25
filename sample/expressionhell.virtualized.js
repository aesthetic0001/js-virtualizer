const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJyTS2WtkktNFVJIFUqVS61KlW+tEpJrbQWxhRRSU1th4kJNqVoAGw0NFw==', 'base64');
    VM.loadDependencies({
        5: multiplier,
        18: b,
        122: a
    });
    VM.run();
    return VM.registers[130];
}
console.log(evaluate(1, 2));