const JSVM = require('./memberexpression.js.vm.js');
const object = {
    a: 1,
    b: 2,
    c: 3
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJzj4GVgYGBMFLQI4OUAM5ME1QN4hXgt1DksGBgYGDjUQYLJQist1AUtAlYKqfNaMPWqAwCXyAcM', 'base64');
    VM.loadDependencies({ 80: object });
    VM.run();
    return VM.registers[141];
}
console.log(evaluate());