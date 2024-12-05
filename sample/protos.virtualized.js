const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJzjZ2BgMGBJYWBgYCtKzEvJzxUvnZvCAeIzMJ0Ak5EMDAyM3KUpc1NEb6TY8/7///9q6g0GRgbROaksqQwMDMw5+eniNzRSOUAcJiaI1lKQJhaQAQLBqTmpySWpKQpliTmlqUZWEqkpJ1RTUko5EMYzMK0DWzLnBOMJmDT3jVSNVABuzCca', 'base64');
    VM.loadDependencies({
        40: console,
        157: Math
    });
    VM.run();
    return VM.registers[239];
}
evaluate();