const JSVM = require('../src/vm_dev');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('789c53eede7453b9bb5b5eb55bbe5bb9fb66b74ac64d79e58c0c105b5eb5bb3b03262e2cd3ad0f0098f9119e', 'hex');
    VM.loadDependencies({
        31: b,
        178: multiplier,
        217: a
    });
    VM.run();
    return VM.registers[28];
}
console.log(evaluate(1, 2));
