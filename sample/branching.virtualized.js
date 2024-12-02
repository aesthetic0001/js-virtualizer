const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c638e636060602b4acc4bc9cf158d9b19c76ec6c0c0c0c0c80d26ef8208ae38b39966c28a66cc2095cc39f9e9a2714e10654cc8ca988f323030f007a7e6a42697a4a6289425e694a65a8999711f55e6e6be2b66c6ad08a2b9e2cc9ccc98e2ec1f3080817c9c629c625c1c3fc86439b0f902ee45a98925a9450a251989790a067aa6c2d271bc0c0c0cea6059499fd4e26288547e91426a6169628e42493e54993e0085132a64', 'hex');
    VM.loadDependencies({
        66: console,
        153: Math
    });
    VM.run();
    return VM.registers[27];
}
console.log(evaluate());