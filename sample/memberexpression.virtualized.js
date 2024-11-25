const JSVM = require('../src/vm');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjrmFgYGBMFKmZUMOsD2ImiehP0JerqdEHcxmYQ0GCyXL6+qEwCaFfNVoAEGYLEg==', 'base64');
    VM.loadDependencies({ 144: object });
    VM.run();
    return VM.registers[250];
}
console.log(evaluate());