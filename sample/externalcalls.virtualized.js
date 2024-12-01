const JSVM = require('../src/vm');
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
    VM.loadFromString('789c8d90b14ec3301086cfb14b8814962a199025cb334c302231585c07867ae00d22ea224b562bb541f0027e853c90873e44c60ebc43376443daa20e74b1f5ebeebefbffa31c00a85bbe557ccaf30000843088df243e1401e0ea79d19ad5a271f2a971ae0e0c056393828769a0678c5fdec95b792f1f2551a96e0120134a5981a84e69ecb571aee2fe07971de348c4d16124a9d111c087717996a3eb17b37e77ad5ccea5f9fc8d16b73e488158fe13303bc155daac5b33fbcb1a28a963f4b1b2ada9d0637eb801905d4274fbd09def729d56f4a9be4dbd9b58af75bf117dbf4dea625045a7bdae95d5c2da5d81cac77baabd7912cd13c14b3efee237df17685fc2', 'hex');
    VM.loadDependencies({
        77: console,
        133: object
    });
    VM.run();
    return VM.registers[230];
}
console.log(evaluate());