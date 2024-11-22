const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c3d8d390ec3300c049796cf34ee09ab35f2523d6dcbfd0edb4044a47666963402382d005c26001f8fd04346b2c32368bdd9d2ee0f291fb6245bfb6276cbdcda64677697b5bc2fb54a2ad9e1d2b8dfed5ec9e6c396646b95daec2cd9e2ffaeffb8bff1fe00092441a5', 'hex');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[40];
}
console.log(evaluate());