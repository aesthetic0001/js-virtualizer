const JSVM = require('./spread.js.vm.js');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxdzr0JgDAQBeCXxFhYpAsiVoJjuIw/YCO4g2Nc41Jvh1tDEhXB8j7eu7tArwDM1AoAa6lSDQxsOAT1yczcRgDOqsQbxgzmgylDkaChvr0lq//HyidWnfRMi7d97fWgS4PJb+A+UFPOUiR2yoMXRYsqXQ==', 'base64');
    VM.loadDependencies({ 130: console });
    VM.run();
    return VM.registers[222];
}
evaluate();