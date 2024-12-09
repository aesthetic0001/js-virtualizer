const JSVM = require('./unary.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjmGv/gAEMeN/P5Z/LwMDAnJOfLrE+fa40iMMkthckJybMwMDAyP+agYGBwy+/RKGkqDSVbe7e18J79wrzvWZk1HzNNnevJointn5uOlHmcILMSUvMKUYyiIEcg1hBBhnADBEDCZFvjiGKORgeEwNpZeS9ORcAAv9XPg==', 'base64');
    VM.loadDependencies({ 103: console });
    VM.run();
    return VM.registers[217];
}
console.log(evaluate());