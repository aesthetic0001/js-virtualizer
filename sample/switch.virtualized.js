const JSVM = require('../src/vm_dev');
function evaluate(a) {
    const VM = new JSVM();
    VM.loadFromString('eJxjkmZgYGBUqNgoLVTBwMDgwQLiM+fkp0sqCktzgCWZnBgYGBiY3oPYLNMYGBjYEhUyixUMpaSdpmk6Ob3nVpQWlhZgYGBYDiJEmUCamMgx0QjDxFAQwUqMCSJgE/JSM0syUosUDBXy8ouwmMcKAOBwJKo=', 'base64');
    VM.loadDependencies({
        19: console,
        177: a
    });
    VM.run();
    return VM.registers[251];
}
evaluate(1);
