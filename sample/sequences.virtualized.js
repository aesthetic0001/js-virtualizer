const JSVM = require('../src/vm_dev');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyVjj1qw0AUhN+uXJgIjFHziItgSCFUrV1GJ9BNwkIgd1AxTKXazUIKHeFdxVdRu2Y3P32ax/C+GWY8RMRpxBg1RkXclUfz8fn+zAX7Sr2JiPhQ9AkWB7PQEgt8wb7eRiOU/0+Lzt/iSVdomo8icjkzXXuyY+GaVmVydGostHUUNSpsesF0yDnfb3BXn9afPtY+q7q0NicwDKS1N3i8Iq090BXv246/c23hnn8R8Vudy5CGELbWuHBMx5zz1wOKuk5f', 'base64');
    VM.loadDependencies({ 142: console });
    VM.run();
    return VM.registers[163];
}
evaluate();
