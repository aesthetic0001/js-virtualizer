const JSVM = require('../src/vm_dev');
const a = [
    1,
    3,
    5,
    7,
    9
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyl1MFq20AQgOGx4lIjt6A4hzbqZesehOcWTClM8KFuGkOhJEiU9mqomooIyyRpHmchtxz3MfQYfYLqtKeAVXZlW9tsWhZ6k4T9jfTDjocAAM9K9NSF/4pKjIgGBNDx9aMdxkuMOB9wAPjY1Y/y4myfV9hTNx1PKMGT6rqbAECQnGfLZbY4YxmbTCZsHKJIRkLIPscKAwC41fIjUz51kfemF+n8XMnzqzX+2sJjW/Is6clxccHy9IrlRbHcECGKcktRGdT16leL0fa1uMaExhS5a2Lsa7FIQ+RyxLnoE1Z4jLMp4juOR8Tfcx4R7aq8+10tHDDJRSTlQEmf9DM9Tlaip3/gJXrcoR5XAMDze32HB0N2Pc9/pKFIilGSHPalqIRKIZoRY3PEF5cRL+zQw/HfppzYomeJfdUoWzS910IoEt5Kdb366VI7MCQ79hRn90vDnf73jllh5lLB34YeWx99o83HpvnBxXxqln3zHy2Lb/9uuXJuuZbsll6zG2LsYCdCHKBeCtQshZg2R/ekS+2Box45LgXanFuqiOJmLVCzFlr71MV+cC2YfPCwZK8F//P3LE+bsGsgJBGb71nXK+mSlrWULuv7b/Nc317q+5d/pP4NnbR0oA==', 'base64');
    VM.loadDependencies({
        71: a,
        239: console
    });
    VM.run();
    return VM.registers[41];
}
evaluate();