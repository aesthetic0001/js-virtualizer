const JSVM = require('./templateliterals.js.vm.js');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJxTrGZgYGDOyU9n7YyrZgRxGAVOMTAwMAhog9iKe0BsxRcMDAwcwaW5uZl56Qq8e/a84N2z5wBYlFUhMS8FJqQDFmIA8ZSqT+3hPXVKm6ezOq4aAOLkHmk=', 'base64');
    VM.loadDependencies({
        44: b,
        94: console,
        192: a
    });
    VM.run();
    return VM.registers[127];
}
evaluate(1, 2);