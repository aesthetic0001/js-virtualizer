const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjmsvAwMAgMn0uE4jBJXdm+lylM2cEzjAwMFiygISYc/LTxZ4HzOUAcRiZloCUM/mC2OJzl0xXWbLEl/v53IC5xtP5/v//v58JYpzNXEsADmwZZw==', 'base64');
    VM.loadDependencies({ 80: console });
    VM.run();
    return VM.registers[26];
}
evaluate();