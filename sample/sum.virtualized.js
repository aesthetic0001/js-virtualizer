const JSVM = require('../src/vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('D8M2D1ZDGsPDVg9WWBzDw1YPIMMm', 'base64');
    VM.loadDependencies({
        54: a,
        67: b,
        88: multiplier
    });
    VM.run();
    return VM.registers[32];
}
console.log(sum(1, 2));