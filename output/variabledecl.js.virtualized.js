const JSVM = require('./variabledecl.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJzj0WRgYGAUnqLJA2IwCS/RFNOcskSYRxMAJkAD3Q==', 'base64');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[12];
}
console.log(evaluate());