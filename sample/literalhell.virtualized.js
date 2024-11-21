const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('AVkAAAAHATkAAAAIGllZOQE5AAAACQGoAAAACho5OagaWVk5ATkAAAAFAagAAAAGGjk5qBo5OVkBWQAAAAMBqAAAAAQaWVmoGllZOQE5AAAAAQGoAAAAAho5OagaOTlZAVkAAAAHAagAAAAIGllZqAGoAAAACQGkAAAAChqoqKQaWVmoAagAAAAFAaQAAAAGGqiopBqoqFkBWQAAAAMBpAAAAAQaWVmkGllZqAGoAAAAAQGkAAAAAhqoqKQaqKhZGjk5qA8uOSY=', 'base64');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[46];
}
console.log(evaluate());