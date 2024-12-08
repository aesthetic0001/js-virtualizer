const JSVM = require('../src/vm');
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjucLAwMCck58u8SPiCgeIw8h0iYGBgYFpDojN8pGBgUE8PDGzJDMvXSEtv0jBUKE4NTk/L0VPT0/yyqWPGpcuzeH+cQWu9wdY7yUwew4DA/MLySs/5mj8+HGJ5/oVpissRNjG6pKfl6qIYrY7AC49NVs=', 'base64');
    VM.loadDependencies({
        88: console,
        215: sleep
    });
    await VM.runAsync();
    return VM.registers[136];
}
evaluate();