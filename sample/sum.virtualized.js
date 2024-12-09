const JSVM = require('../output/sum.vm');
const multiplier = 2;
function sum(a, b) {
    const VM = new JSVM();
    VM.loadFromString('eJxTtj/SJxXLwMDApPzsZyx7rP0zccNYAEZmBrs=', 'base64');
    VM.loadDependencies({
        142: b,
        196: a,
        249: multiplier
    });
    VM.run();
    return VM.registers[49];
}
console.log(sum(1, 2));
