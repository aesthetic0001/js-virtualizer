const JSVM = require('./literalhell.js.vm.js');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJw9zdENg0AMA9BAKQdIVylD9EbJdv7OHFnJk1Rn2v6+2M6AmR2jzOwcNLPLs9iBlDWvwpiZp657T9AzS/ZQZnOinEzZ2gHKl3/3UPccqf1gNiBkzcnf/rzuLZAewe/+zGzt/hmyRbZ6gB6RjorXGx+NSzUZ', 'base64');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[37];
}
console.log(evaluate());