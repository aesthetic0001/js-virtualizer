const JSVM = require('./externalcalls.js.vm.js');
const object = {
    call: function (a, b) {
        console.log('External Call');
        return a + b;
    },
    write: function (value) {
        console.log('External Write');
        console.log(value);
        return value + 5;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyNkTFrwzAQhU+OIucMXYSWLuaCF0Ondixo6tSlQ/+BSdQSIhJIXNpf6cV7BAr6DVmL1DrEZMmmxzt9955UIwBM7PazEnPMo2CoAQDwEM+1A4C7101rdpvG0ktjrULtmNaHQuAc6xuuzx7pgZ5IE8rkcwDIWC85k65XqOWYxheNtZUIf7jsEocRNxkCJDW9iBOQypsS3b+b/ZdtaftB5ue/Wtz6TEy68jrSCJdd4dSb2bdmOWYNudLE9Hu3ak0lg8vd+Q0A+4Tw59Kn4HOfVnTJX6fZY/SV746s69ZJiUEVJx+8ctwzzvtCuuBGv4OpPhMl0kL8Aqm9Z+Y=', 'base64');
    VM.loadDependencies({
        33: console,
        229: object
    });
    VM.run();
    return VM.registers[99];
}
console.log(evaluate());