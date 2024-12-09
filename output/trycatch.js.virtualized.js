const JSVM = require('./trycatch.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJwTdmRgYADhCZIRDAwMjOwmDAwMDOyBIDbnGaC4QEhGZrFCZrFCYp5CalFRfpFchMkZbhOTQN6IJxEcEfKcIG3MOfnpqiZiEWAzmMC6GdjPgM3gZWBgEHFOLE3PKAEbUZGcWlCSmZ9nJRcRyMsdGHhGLiLQEUQzmkSIYTOOEcM4MbfMvMScnEqFpJz85GyF1IrU5NKS1BSYgRCDAEyrLtk=', 'base64');
    VM.loadDependencies({
        22: console,
        228: Error
    });
    VM.run();
    return VM.registers[217];
}
evaluate();