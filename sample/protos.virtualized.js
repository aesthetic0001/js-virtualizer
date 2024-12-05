const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJzjZ2BgMGD5x8DAwFaUmJeSnys+Of4fB4jPwCQMJs8wMDAwck/+F/9P9NE/e97///9f/fWIgfGR6PFfHL/AKh6ByX9gdcd/Mf4Sdf3FApJhzslPF3/kCFHGxAQxdDJIGQvIaIHg1JzU5JLUFIWyxJzSVCMriV//hFX//Zss8eufK4jmfvTL8RcAiJA2aQ==', 'base64');
    VM.loadDependencies({
        65: console,
        95: Math
    });
    VM.run();
    return VM.registers[11];
}
evaluate();