const JSVM = require('../src/vm');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63e6616060604c14e2e1e6614e0531938452b953a5787852c15c06e6429060b2546a6a214c82ff318f1a00b05f0827', 'hex');
    VM.loadDependencies({ 11: object });
    VM.run();
    return VM.registers[227];
}
console.log(evaluate());