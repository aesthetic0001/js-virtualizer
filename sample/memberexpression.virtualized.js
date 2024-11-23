const JSVM = require('../src/vm');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63ae666060604c14aa0eafe677a856030014df0330', 'hex');
    VM.loadDependencies({ 87: object });
    VM.run();
    return VM.registers[64];
}
console.log(evaluate());