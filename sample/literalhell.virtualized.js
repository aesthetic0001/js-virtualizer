const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJw9jTkSwzAMA0HLZxr3HKt1mZ/gkXyhKvQZcSK1uwvSBOC0AHAZAXw8go8UyQ6PkPVmS7s/En3Ykmzti9ktc2uTndld1vI+2arEZIeT4363e5WaD1uSrZVss7Nki/+7/uP+xvsD+aQ5qQ==', 'base64');
    VM.loadDependencies({});
    VM.run();
    return VM.registers[46];
}
console.log(evaluate());