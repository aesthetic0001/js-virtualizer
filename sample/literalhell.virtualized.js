const JSVM = require('../src/vm_dev');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJw9jckRwzAMA0FfsvN1CRzr6zbYFTpIISoDlWXEifTdXZAmAKcFgMsI4OMRfKRIVjxC1ps97fFI9GHXZFtfzG6ZW5vszO6ylvfJViUmK06O+90eVWo+7Jpsq2SbnSVb/N/1H/c33h+UTy+T', 'base64');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[142];
}
console.log(evaluate());
