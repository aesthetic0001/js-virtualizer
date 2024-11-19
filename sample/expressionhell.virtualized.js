const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('GoUkOhuxJDoaeaYkGnl5Ohx5OnkaeSR5GrGxeRyFhbEchTqFGoUkhQ+1hSY=', 'base64');
    VM.loadDependencies({
        36: a,
        58: b,
        166: multiplier
    });
    VM.run();
    return VM.registers[181];
}
console.log(evaluate(1, 2));