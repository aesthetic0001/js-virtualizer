const JSVM = require('../src/vm');
const object = {
    call: function (a, b) {
        console.log('External Call');
        return a + b;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63ce62606060cec94f17c9da91c5b89181818181b11f44b0173232cf676060e0f5cc2b492dca4bcc51704eccc9112ddc385f6ee3c67eceac42c64266427a390c15b4158c146c1518c341c28cda0c0c0c4c72e1e1da72f3e787631ac5929c98932392258166161323c82c66987a308f1545b7d007c26e910c4a2d2ecd2951c84f5348ad80fa08649f9582dcfcf91f508c630499c52897f5214b28364b0b00b8ea4994', 'hex');
    VM.loadDependencies({
        24: object,
        184: console
    });
    VM.run();
    return VM.registers[93];
}
console.log(evaluate());