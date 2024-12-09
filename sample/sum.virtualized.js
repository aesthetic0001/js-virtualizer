const JSVM = require('../output/sum.vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJzTDNh+i6mLgYGBSTN0Qpd2V0Co+OMuAEfMBw8=', 'base64');
    VM.loadDependencies({
        144: multiplier,
        183: a,
        218: b
    });
    VM.run();
    return VM.registers[227];
}
console.log(sum(1, 2));
