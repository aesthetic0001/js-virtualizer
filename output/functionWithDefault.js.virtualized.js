const JSVM = require('./functionWithDefault.js.vm.js');
function evaluate(a = 1, b = 1) {
    const VM = new JSVM();
    VM.loadFromString('eJyTYWBgUFERYGBgYFHbsEEAzGJVs7QUEBDYYKmpLcDEqM2k/P///4cntRmYNlgyKGkzMDAw5+Sniwg4aLOBOIwqrxhAhuwBsdk0wewkMKkEEuE/qcmkyaf9SlPg1as9/ALaDtoC2pNMNFm1AT15FtI=', 'base64');
    VM.loadDependencies({
        52: b,
        64: console,
        146: a
    });
    VM.run();
    return VM.registers[5];
}
console.log(evaluate());