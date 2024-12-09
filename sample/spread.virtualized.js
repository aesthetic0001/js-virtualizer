const JSVM = require('../src/vm_dev');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjP8lyk4GBgTGJaTIDAwOT2Mmbk0VfnmQ/aXLyJftNFpAYYzJTOAMDA7PYzcnhEIFEsAAjQiAJLMACEjA5eROmLwUsyoqujA2qTLT7JMtJkME5+eniN0+d5ABxGMHOYIBYIHFycrf65Mnh3DdPnjrpCgCghS20', 'base64');
    VM.loadDependencies({ 202: console });
    VM.run();
    return VM.registers[121];
}
evaluate();
