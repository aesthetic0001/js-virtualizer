const JSVM = require('../src/vm');
const a = [
    1,
    3,
    5,
    7,
    9
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyFzj0KwkAQBeBnXDAQ/KlMYbOEwJbT+QsW4jSeINVCihAkkoB4iwH3jLnD9pENiKXdvAffY/aiDyxHwyfmzJilAfCOCMBs45ky71cewE2Favro6rV3FIcwiSwARH24VQFgfnlWZXNva12+9C4lW+TW9oknRwsA2z8bKVn+gWEYGiVfYJzEMgIewYhV+Exdu7ZKhX3OTIkRJ+cPhd4wbw==', 'base64');
    VM.loadDependencies({
        32: a,
        143: console
    });
    VM.run();
    return VM.registers[83];
}
evaluate();