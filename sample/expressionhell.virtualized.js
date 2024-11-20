const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('GhD8KxtX/CsaJC38GiQkKxwkKyQaJPwkGldXJBwQEFccECsQGhD8EA+ZECY=', 'base64');
    VM.loadDependencies({
        43: b,
        45: multiplier,
        252: a
    });
    VM.run();
    return VM.registers[153];
}
console.log(evaluate(1, 2));