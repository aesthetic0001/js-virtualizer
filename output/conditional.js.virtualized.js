const JSVM = require('./conditional.js.vm.js');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyljr1qAlEQhccEC7m7Jgj+YZG7IIjCCBY2AbERbOx8gsVckmLJkvWaN9rHOG9iYTWvsJYyKv5g6TTzdzjf6YCaQB1E1GpguqNjGUaFiKqR3kuGYQoOdX5N0u8Bb9HV5SUSFUczFYUTInpbusStvPuy/3GycZ8BZNIXmQWQQnuZsUXniqwaLhRUu0Ob/FlYfoH1UeQNnu5P5h8CborU1aobMhG9zzMXe5dZ/xP/2tFwbMCaqHf8thduvT690sy6v02cWJ+eZcbjMWbpNmYA8ZckB4wzaK8=', 'base64');
    VM.loadDependencies({ 220: console });
    VM.run();
    return VM.registers[80];
}
evaluate();