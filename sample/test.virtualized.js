const JSVM = require('../src/vm');
function random() {
    const VM = new JSVM();
    VM.loadFromString('789c634e656060602b4acc4bc9cf1549354d650f6060606060fc08263d4004676a006380d0d9002d00b25707fe', 'hex');
    VM.loadDependencies({ 53: Math });
    VM.run();
    return VM.registers[205];
}
console.log(random());