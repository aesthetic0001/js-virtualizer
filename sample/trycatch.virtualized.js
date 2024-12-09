const JSVM = require('../src/vm_dev');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxtzEsKwjAYBOBpLFRxI/gAy7/ItldwJzbiAbxAraENhkb6AL1Fb5QzZdG9NuJKVzMMzLccAOwB9FMCEDAHAMyOPRTvfXEuVcNVw7OKy7o2dUxOJM7ZGfW0plM43ibaFFsXkTeYf4MJb6QAVoesK8rWE49c3ltlql1MNk2sFTHZYcy5o+gfF/xwm6OqMq2f/KJNfuPyIfOuldcv+IFesB00oA==', 'base64');
    VM.loadDependencies({
        7: console,
        144: Error
    });
    VM.run();
    return VM.registers[223];
}
evaluate();
