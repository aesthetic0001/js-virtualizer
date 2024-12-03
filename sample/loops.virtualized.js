const JSVM = require('../src/vm');
const a = [
    1,
    2,
    3,
    4,
    5
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789cb338de6179e2b855c809eb1327944242f8431818180258d41918189873f2d3c5e27eab7380384c4cbd0c20aa91818181916509030303b75b7e91427e9a424e7e7e81b87aef1295dede4671f5de13209a3b4efdb73adfffffff57da1cefb0387e9c021b32f308d8600700b0353b97', 'hex');
    VM.loadDependencies({
        136: a,
        251: console
    });
    VM.run();
    return VM.registers[81];
}
evaluate();