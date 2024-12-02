const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyFj8ENgzAMRWNcgdQrlAUyQCXOXiYFqZdKZQ8v4R2ySyZghN4iocqGFHHqJcn/+Xr+rhnFOQehjkj6GCE757CLlDdjMuOiRscSt/gDol6HMaIZw+FMjToICnHGAEh69pGSJ8qmqpPCohTTztywjgYxhA0wHPQs5EX2ykORNaHNCRuso5zKV0NWJhvJakAwEuXgc06mqpPCogqjXRm1EL7ezxsv3Nie1svtvSTOPka6sizyP7v+sqBZaD98/wIkeWiw', 'base64');
    VM.loadDependencies({ 228: console });
    VM.run();
    return VM.registers[244];
}
console.log(evaluate());