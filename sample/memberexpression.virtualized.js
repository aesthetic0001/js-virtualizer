const JSVM = require('../src/vm');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c637ec8c0c0c09828fab0e921b316889924aad5a4a5fcf0a11698cbc02c01124c56d6d2928049086b3cd4070056210caa', 'hex');
    VM.loadDependencies({ 130: object });
    VM.run();
    return VM.registers[40];
}
console.log(evaluate());