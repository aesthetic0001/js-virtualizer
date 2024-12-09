const JSVM = require('./expressionhell.js.vm.js');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJwdyKERACAAA7EFahEYluui2DddAtUtOHC5iF2BB0aUmVrJswfkf8o6uQ/zGLA=', 'base64');
    VM.loadDependencies({
        99: b,
        192: multiplier,
        233: a
    });
    VM.run();
    return VM.registers[227];
}
console.log(evaluate(1, 2));