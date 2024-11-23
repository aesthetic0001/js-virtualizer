const JSVM = require('../src/vm');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjPsPAwMCYKHTG4gxzP4iZJNRv0S915kw/mMvAfBwkmCzV338cJsF/9YwaAJjvEPA=', 'base64');
    VM.loadDependencies({ 56: object });
    VM.run();
    return VM.registers[213];
}
console.log(evaluate());