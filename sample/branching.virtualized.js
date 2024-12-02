const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789cad8d3d0ac24014845f7641212029828295ab7629d46245b0f11082ad3ccd9a04d60437d1b388177897b1f204569e4336fe20c4c2c229669ae1fb380140cd601a66db26c55447000047967db4e512c6e827c8ed93eb2c6ad2f971639f371e008037575aad0b158a03eabd9ab650067d298f2d94895d97f08c8c66b74d990e25d425f22c7959e53b157e7b61b122c945641416ca8822c6548c069397a9343816e5f8276a00c085d1ec0a65fee71b577dece95bfd02eebdc15ae5f9839a19a1767bd4a2c8be1bb87fa2e11df8c26ac2', 'hex');
    VM.loadDependencies({
        104: Math,
        204: console
    });
    VM.run();
    return VM.registers[154];
}
console.log(evaluate());