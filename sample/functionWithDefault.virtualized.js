const JSVM = require('../src/vm_dev');
function evaluate(a = 1, b = 1) {
    const VM = new JSVM();
    VM.loadFromString('eJzjZ2BgUGESZ2BgYLEXEBAHs1jt+fnF1cUF+EU9xN1kPNx4/////7Deg0mAn4HFg4GBgTknP11c/IMHB4jDyNTEwMDAwHQAxObQArMng0llkAh3vRaTloRHk5Z6U9MBbnGPDx7qHjbhouYeAEkmFHg=', 'base64');
    VM.loadDependencies({
        60: a,
        87: b,
        240: console
    });
    VM.run();
    return VM.registers[55];
}
console.log(evaluate());
