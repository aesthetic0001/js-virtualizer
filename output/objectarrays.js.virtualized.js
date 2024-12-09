const JSVM = require('./objectarrays.js.vm.js');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyNjjEOwyAMRU0oCksUKZU65ABIrNwoTaRmKOqlcgoPPgCX8RUqm9KoWxfgf6znN6FnADDLlD3JY3UFACxkKrXYtLhIAci5jt9dlussVq9FOpttlsY6gYAyjIty9pliICqaup9kWxLMkHBGWe1YEbpAcaZHpsD8UU4tTuR1z1JhQCW2r5lUpihJNdyhJCpHKCVq6n6Sbakxhh29CNnn6zHyWO2MekHzyinkTFfG8Y/Z/Tvr9Hu44RsM42x8', 'base64');
    VM.loadDependencies({ 15: console });
    VM.run();
    return VM.registers[22];
}
console.log(evaluate());