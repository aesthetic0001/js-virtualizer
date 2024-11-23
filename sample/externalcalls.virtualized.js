const JSVM = require('../src/vm');
const object = {
    call: function (a, b) {
        console.log('External call');
        return a + b;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjzmdgYGBJTszJEcr/nc9YysDAwMQowsDAwMyWv5aRqVSE/+JaNQCOAAfv', 'base64');
    VM.loadDependencies({ 251: object });
    VM.run();
    return VM.registers[209];
}
console.log(evaluate());