const JSVM = require('../src/vm_dev');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyFjcENgzAMRU1iqUg9cKKBCeJJKjFHK8qhVtmEHf4+TJBLRkExpRKnXmy9b+u/GkTETomInBBR5XKZHTRHVTFyJ/In4oPaEQ5WU8qqPo6IgPbrvrnc/PvzCjqjLuDMR4dPYhTJHWQt+6qYcQFb18M+/Q0qe/C0gEvQJvBiT2FKCw92Dk0a/gunr7D5Ce8blTw/yg==', 'base64');
    VM.loadDependencies({ 112: console });
    VM.run();
    return VM.registers[87];
}
evaluate();
