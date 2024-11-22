const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjPMfAwMDIuJCBgYGJ8S4DAwOz1LlzdxkfMDAwsPAvfCAVem4h/+FQNQCm2wqJ', 'base64');
    VM.loadDependencies({ 177: console });
    VM.run();
    return VM.registers[195];
}
console.log(evaluate());