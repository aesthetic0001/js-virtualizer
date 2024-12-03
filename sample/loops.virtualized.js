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
    VM.loadFromString('789cb390e6b39c236da53dc77ace1c256d6d7e6d060686781625060606e69cfc74b1a6154a1c200e1313070388326760606064d9cec0c0c0ed965fa4909fa690939f5f20aec4b15d8583c35c5c89630e88e66e525aa1c4f7ffffff95760069d214e6', 'hex');
    VM.loadDependencies({
        14: a,
        168: console
    });
    VM.run();
    return VM.registers[196];
}
evaluate();