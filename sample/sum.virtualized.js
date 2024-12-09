const JSVM = require('../output/sum.vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJyT+X8ijE+VgYGBSebgN1Um1f8HhW1UAUrUBsI=', 'base64');
    VM.loadDependencies({
        86: b,
        200: a,
        246: multiplier
    });
    VM.run();
    return VM.registers[60];
}
console.log(sum(1, 2));
