const JSVM = require('../src/vm');
const object = {
    call: function () {
        console.log('External call');
        return 3 + 3;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjvsPAwMCSnJiTI3Qn6Q7bHW1GBn4bbTUATigGVg==', 'base64');
    VM.loadDependencies({ 98: object });
    VM.run();
    return VM.registers[60];
}
console.log(evaluate());