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
    VM.loadFromString('789c8dcf4b0ac2301080e13156522cd459885d08458a3770e30be94adce92914433122f41aae02398377f04c738281caa4a8e0cad52443c8c7af180060a859c9a19f7bcd85f7e801c084556f8c9a0b4444004852d947b2ef56f634c29a63b92845f28d3200d0899cbcdcdadbc41e2795b5d78cc94d894cc6a46526c835cf74da34cd7dcdcf39f30279e9718558783f10fb10d1db3035c5140c178c5d30f2b771beb406b97ceadc2e23873213433589f0506d61f9292c3f85fb7f4a62517e32ca6f461990cd0b544266fa', 'hex');
    VM.loadDependencies({
        117: console,
        188: a
    });
    VM.run();
    return VM.registers[110];
}
evaluate();