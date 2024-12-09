const JSVM = require('./protos.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJylkM9Kw0AQxidJk5BiYRBdmpuCkx56KPgGgnhPL+NduyKIBcUwF4U96cu4fYi+gu8T2c0frAdt9TLMzux8329GCQAAWVFNYmQEAJeKASCIrWVC6x/xIVqeIA4QAIYktshcObpb3gyx5LEfUKkTUeTynFMbpylNkUuOpNiv6/p9JQChLVuzqHEdJhzJhHngNE7GvqfQR6cXTFcSynE0quv6w9E9t3TGMKHp6ExPd+BLpzEaJsEtOE3P6dub5msOmYSLdoW3tVvBdCtof6/XlkhrJtQdkf5GdB2j3oZIJW4eZjrJOZ39xFZtsr1Ujk2XmXT6XIq/Z/B1LHMu2Xxx9fTweFstckGKEdMpSym/jI7J54mPs+Y+FNIuEt59r3c/Orv4J0D1F4DB+fJ+p81zQdv//QQso4Rr', 'base64');
    VM.loadDependencies({ 81: console });
    VM.run();
    return VM.registers[104];
}
evaluate();