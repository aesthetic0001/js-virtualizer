const JSVM = require('../src/vm_dev');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789cadcdbb0ac2301886e1af074410d4a1286e419cc5454417e1df1c1c8ad04990a8b10ab1c5b68ad7e91538790b1923a907843a38f80fc9f2f1bc2e0128253c5ac7fb069da9ac00c0d6f93b056055489d95e72bd72c1d19870d0a1e33fb73e6ce01d466428a5526d6ecc4e5518c9a4acf3b5a4f9b4afbe6af900a9443e3db263f463eb589ea465e147dabe0b702c3b25dcac244f04c242cdbf288f5ba8357292fd886b2bc0955015c1c1a5f91dfff7afd62cf7ef696bfc0ed372c459a3ed43861e270e49265f1f782e34d6878076dd071f4', 'hex');
    VM.loadDependencies({
        86: console,
        120: Math
    });
    VM.run();
    return VM.registers[73];
}
console.log(evaluate());
