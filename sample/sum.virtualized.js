const JSVM = require('../src/vm_dev');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJxTXvd4NuNSBgYGJuWlHUtV161bKjx1nT4AXmEImA==', 'base64');
    VM.loadDependencies({
        136: multiplier,
        155: b,
        227: a
    });
    VM.run();
    return VM.registers[149];
}
console.log(sum(1, 2));
