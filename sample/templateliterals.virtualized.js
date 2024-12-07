const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJxj0WdgYGDOyU8XFxHV5wBxGJk+MjAwMDAdBbFZ4kFslpsMDAwcwaW5uZl56Qrq8fE31ePjq8CirAqJeSkwoSSwEAOIJ6H/MV7948ej3CL6ovrOAOksGG8=', 'base64');
    VM.loadDependencies({
        21: console,
        98: b,
        122: a
    });
    VM.run();
    return VM.registers[161];
}
evaluate(1, 2);
