const JSVM = require('../src/vm');
function call() {
    console.log('Outside call');
}
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63737167e44f7357030005e50175', 'hex');
    VM.loadDependencies({ 68: call });
    VM.run();
    return VM.registers[102];
}
console.log(evaluate());