const JSVM = require('./sequences.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyVTjuuAjEQm2wAjXaL7RY6iKCDgpYT0TzpdXMOFzkAUmpOwRno6HyBPcEGJXx6Go9lj2U7iojTxFnSlJSpK4L/+z8vMXFVXWdSTiiwoaXBLPTgRFfspqLXRMXvadHbi7Q6UuNtLiLHPaI/AGuIyFLjqIgeTg3F7TxEDUprd2wXOef7g+J8E8d3IWqhVV5q/YYIA2D9gw23jOOBXJffU4fPXpuwwjci7lr3IsQhhGtvmDCL85zz5Qmvglse', 'base64');
    VM.loadDependencies({ 254: console });
    VM.run();
    return VM.registers[181];
}
evaluate();