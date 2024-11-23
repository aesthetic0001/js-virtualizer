const JSVM = require('../src/vm');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjfsnAwMCYKPQy6yVzDYiZJFSTVSP18mUNhJsM4/JPeKkGAC1ZDsg=', 'base64');
    VM.loadDependencies({ 106: object });
    VM.run();
    return VM.registers[144];
}
console.log(evaluate());