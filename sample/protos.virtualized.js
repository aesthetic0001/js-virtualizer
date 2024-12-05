const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJzjZ2BgMGBJYmBgYCtKzEvJzxWfwpvEAeIzMG0Bk2YMDAyM3FOSeJNEo5Psef///3+1IpqBMZojGiwNUToFrKgimjFa9F80C0iGOSc/XTxpEkQZE1gBxERGFpCJAsGpOanJJakpCmWJOaWpRlYS0VPMVKdM2SIRPeUfiOZOip4UDQDcIyUG', 'base64');
    VM.loadDependencies({
        13: Math,
        146: console
    });
    VM.run();
    return VM.registers[174];
}
evaluate();