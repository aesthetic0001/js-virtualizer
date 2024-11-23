const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c3d8d390ec3300c0497be64a7496b1056eb5efd7e973fd807062222b533b3a411c06901e03201f878841e3292158fa0f5664f7b3ca47cd835d9d617b35be6d6263bb3bbace57da95552c98a4be37eb747259b0fbb26dbaad46667c916ff77fdc7f78ef707dad72651', 'hex');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[24];
}
console.log(evaluate());