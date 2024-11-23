const JSVM = require('../src/vm');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxj7mJgYGBgDmFgYGBMlOrqChHqmtPFb9qlBgA0swV/', 'base64');
    VM.loadDependencies({ 156: object });
    VM.run();
    return VM.registers[53];
}
console.log(evaluate());