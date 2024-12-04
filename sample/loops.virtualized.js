const JSVM = require('../src/vm');
const a = [
    1,
    2,
    3,
    4,
    5
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c8dcecd0a82401405e0db6410791317fd300431886f106d5d4443d03668df8489288e48cfd4c35cdfc1c76899310359e0a6dd3967f171180100cc383113266bc92990d297000366a7e10a3905883e02c0c1b153ae9305d6343665c094115864b2d318e494a565991689d82c4935a152918b549307000f6b8e7ecde33fe67457c597cc9897bbd8f6d873df603dc33fc4455ca55771d395c8b52e3fcc9214efb80df7daf6f5fc82b23b8516541634ec7caf8b58243d15a31051b9926a8ade197655a3', 'hex');
    VM.loadDependencies({ 203: console });
    VM.run();
    return VM.registers[171];
}
evaluate();