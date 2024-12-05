const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJylj79qw0AMxnU+UwqB/CkccSHDwdfgLaVDli4ZOnTx1ic4mqMZ3Jg4l7yb3yWD/BYFLeXs4ha6FKrhE0LSp58UaAnMQETrNOpV7fbb6n0uAdexpmTRaUFEaiQIMIwJEd1obJi6MAzTcreuy+ptzpd+N0lkcFBpdJi8+NK/Br+1Z1ee/GMGKXKRRQZpYx4xLlDfTGPDbTx2/3c20/yXpBlIcrSN5s1H/yYEvBSZRau7NP4+fa69C762Yef29mG1NuCIm3fd28Ifj32rqq0/nFxpQ/U1ZjR+Y6qfmBlEDyRPnzrtaM0=', 'base64');
    VM.loadDependencies({
        116: Math,
        220: console
    });
    VM.run();
    return VM.registers[216];
}
evaluate();