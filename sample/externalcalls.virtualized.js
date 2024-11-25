const JSVM = require('../src/vm');
const object = {
    call: function (a, b) {
        console.log('External Call');
        return a + b;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c7dcfb10ac2400c06e024a7a8834bb91b5c8ecc3ae952109c9c5c7d832a5528470b5ac1d790ee79837b80bed78d0e72a2051dba6408f9bf244a0040b9eaace521e80100b08d6544a80a0098eeca3abf9499e36de69c215f58efdb891092eacb3600305ef28257bc61d4b18d0100c86a1d6cd36843bef9a506c7cc392d873f8b305aea3bffb68686bceed249da7f4bdc3bdbe7d79babb93a717eff7c14f7add986901af2a1e3305a682595e429f3177aea455f', 'hex');
    VM.loadDependencies({
        98: object,
        145: console
    });
    VM.run();
    return VM.registers[252];
}
console.log(evaluate());