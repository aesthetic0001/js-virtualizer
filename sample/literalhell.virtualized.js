const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('01950000000101e2000000021c9595e201e200000003019c000000041be2e29c1c9595e201e200000001019c000000021ae2e29c1ae2e2950fa9e226', 'hex');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[169];
}
console.log(evaluate());