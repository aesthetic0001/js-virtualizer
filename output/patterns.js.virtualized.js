const JSVM = require('./patterns.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyFjUEKg0AMRaMTBLEwyzKZrcz6r7yBB5EWuin0KNl4LK8wHsO1TKwFV90kvJ/wXwci4iBEREGJqAprmT1kTSJqVF/IXYhPihMCrKaUVc02IQHSDMf25ebenxdLRFegNh+dPt2S6tpDh7LvgogbvHU97NM5iB7B0wIuQczwsz1xm2c/2pmXPP4Xtl/h8hPuwUk0WA==', 'base64');
    VM.loadDependencies({ 27: console });
    VM.run();
    return VM.registers[153];
}
evaluate();