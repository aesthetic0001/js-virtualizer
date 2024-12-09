const JSVM = require('./fakeasync.js.vm.js');
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjN2VgYGDOyU8XWW5gygPiMHJ8Y2BgYOAIA7HZdzMwMIiHJ2aWZOalK6TlFykYKhSnJufnpejp6fGZftst+e1bmPJyU7je5WC938DsMAYG5hd8psvDJJcv/yYQb8pkyk6Ebawu+XmpiihmAwDWiyaQ', 'base64');
    VM.loadDependencies({
        48: console,
        95: sleep
    });
    await VM.runAsync();
    return VM.registers[5];
}
evaluate();