const JSVM = require('../src/vm_dev');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63bcc4c0c0c0c8f88b818181496ae9a55ffc8d4bd5002eef05b8', 'hex');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[129];
}
console.log(evaluate());
