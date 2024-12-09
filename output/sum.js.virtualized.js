const JSVM = require('./sum.js.vm.js');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJxjXRatz+bFwMDAxMp70kveaxkvb6sXAC4/BKU=', 'base64');
    VM.loadDependencies({
        47: b,
        91: a,
        201: multiplier
    });
    VM.run();
    return VM.registers[133];
}
console.log(sum(1, 2));