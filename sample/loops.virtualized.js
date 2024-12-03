const JSVM = require('../src/vm');
const a = [
    1,
    2,
    3,
    4,
    5
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c630a67606060109919ce046270c925cd0c574a4a124862606050050bb14a3f9c19aef4f0a1c0430606066ebeffffff5f349e09a22edb01008449129c', 'hex');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[42];
}
evaluate();