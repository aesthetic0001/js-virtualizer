const JSVM = require('./branching.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjvmb/gAEMWHmusV1jYGBgzslP57K7ek0QxGESmQ+SEznCwMDAyNbCwMDAH5yak5pckpqiUJaYU5pqJXNtfovm/PlHZK7N5wHRQnbXrl5jvmb/LA0M2O14rsnb2fHbMTAwxGOaz4hhvmQYyFiFzGKF9KLUxJLUIoWSjMQ8BQM9c5hNYBtEwLpZs68pMjAwXGKG+4J69pli2scEtS+JGIOV4AbnpBYXQ0zNL1JILSxNzFEoycduAzNr9jUAsjJ1CA==', 'base64');
    VM.loadDependencies({ 213: console });
    VM.run();
    return VM.registers[107];
}
console.log(evaluate());