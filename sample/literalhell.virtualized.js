const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('ARsAAAABAZkAAAACGhsbmQGZAAAAAwEmAAAABBqZmSYaGxuZAZkAAAABASYAAAACGpmZJgEmAAAAAwHgAAAABBsmJuAamZkmGhsbmQ8hGyY=', 'base64');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[33];
}
console.log(evaluate());