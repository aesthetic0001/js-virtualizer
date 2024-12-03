const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c636265606060102962650231b8e4a48b5895a4a505a41918182c594042cc39f9e962fddf5839401c46a65a9072a62320b6386b6d914a6ded11ee7ed66facc6457cffffffdf6f09007cbd0f81', 'hex');
    VM.loadDependencies({ 246: console });
    VM.run();
    return VM.registers[126];
}
evaluate();