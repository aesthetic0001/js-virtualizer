const JSVM = require('./newexpression.js.vm.js');
class Example {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.secret = 0.5;
        console.log('Secret');
        console.log(this.secret);
    }
    call() {
        console.log('External Call');
        return this.a + this.b + this.secret;
    }
}
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjYmdgYGBiEGYAAXUGBgZGhnkgUoJdeJ6KsLA6mMcE4/Gy27LzO7KLgDSxJCfm5EgKO7IzscM1M0A0KwuzO7Lz72MHAHGhCQ4=', 'base64');
    VM.loadDependencies({ 61: Example });
    VM.run();
    return VM.registers[190];
}
console.log(evaluate());