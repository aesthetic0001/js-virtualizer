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
    VM.loadFromString('eJyzyHloKZVj1SplLSWl1NrK38rAwBDPspCBgYE5Jz9dzEl5IQeIw8SkyQCifjAwMDCy7GVgYOB2yy9SyE9TyMnPLxBfqLlXRVPzh/hCTSkQze20UHkh3////1faAQBJQxpe', 'base64');
    VM.loadDependencies({
        35: console,
        225: a
    });
    VM.run();
    return VM.registers[141];
}
evaluate();