const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJwdjDEKwlAQRGdZidi6prVJZ2mzN/jtb9IvmgQJCJ4sFwlzn9/Kppl5vIHpqCMAeXWuS8IkDYCaL02TZJYK4GTeqnF09ZTvQ4rRqx40aWQ9jTWuO5V58v19bhwoBbltGeeQPsp+L2W7MCRkTfv4A9LcGvo=', 'base64');
    VM.loadDependencies({ 35: console });
    VM.run();
    return VM.registers[105];
}
console.log(evaluate());