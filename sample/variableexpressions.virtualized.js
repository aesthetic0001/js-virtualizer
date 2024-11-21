const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63746360606064346660606062346060606096727333602c63606060e1372e93dae366cc5fb9470d00413c0575', 'hex');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[121];
}
console.log(evaluate());