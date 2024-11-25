const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c858f310e83300c45e3ba22ea0a65cdc2d62d1ca113bbe70c14a42e95baf830b9986f50718eca8614317521fc17ebf9a72214e71c8c5542d69f09a2730e9bc47105b381b3828624ade30f487aec604203fd4e66af044125ce1c0059bf6de21c98a3a5d3216149aaa93bf2a4ab414c610b4c072d090791ad725f62c5687bc655d670cce5cab3958966b21ab09889e31262cc964e87842515473d106a217cbd9f57fa90b7775a2fb7f592d48594f84202f27f76f8cdc25dd1ed0bdbf65292', 'hex');
    VM.loadDependencies({ 228: console });
    VM.run();
    return VM.registers[66];
}
console.log(evaluate());