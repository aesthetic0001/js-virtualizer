const JSVM = require('./variableexpressions.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJzjUGFgYGBkeaHCAWIwscRBGMxML16osJS/AHNYWOJUWMrjmFRexLGcVQEAunYJag==', 'base64');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[205];
}
console.log(evaluate());