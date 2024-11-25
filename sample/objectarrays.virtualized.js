const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyFjzEOgzAMRWNcgbpkgDI2TF46svo0FEtdinqNnKuD78RW2ZBWTF0I/8V6/qkFOYQAU51R7WcGCiFgl5U2IA5OBjrhvI3fIdvxAzM6GH9EGiMIJgnuAIj27bPGpEqeqkPCkkzTLtKIrQZ2hS9wHfTCmpj3ymOJtaLvmTZZpxTLVaNehtzkNWBwk9KQiKKn6pCwpOJoV0ErhM/X4yJXafyd3ivsvTgvKWc9CwP/n12/s/A2dPsA1VZFRA==', 'base64');
    VM.loadDependencies({ 29: console });
    VM.run();
    return VM.registers[194];
}
console.log(evaluate());