const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63aa666060601069a8660231b8e4fe36542bfdfd2bf0978181c19f0524c49c939f2e261152cd01e23031f98094334532303030b2fc636060e070cb2f52c8c9cf2f10aff6f9a7e2e313295eedd300a2b925aa43aa8d1bf8feffffbf920962092bdc1256b82581c458c2159e9199938a6e0d2bc21a569035cb2d01fc4734ca', 'hex');
    VM.loadDependencies({ 84: console });
    VM.run();
    return VM.registers[235];
}
evaluate();