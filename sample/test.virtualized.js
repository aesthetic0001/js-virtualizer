const JSVM = require('../src/vm');
function random() {
    const VM = new JSVM();
    VM.loadFromString('789c63becac0c0c0e29b5892c16cc0c0c0c056949897929f2b72f5aa013b88cfc078094c9e02119c570d180d98411a384af2834b8a32f3d2450c0caeb283441891153286333030a8885ebd142e77e9d2294e83ab8c57c1a6731697261543f4c12c60c2d0c7246a00d107e6b1c37860cb858e1a68010083232c22', 'hex');
    VM.loadDependencies({ 19: Math });
    VM.run();
    return VM.registers[197];
}
console.log(random());