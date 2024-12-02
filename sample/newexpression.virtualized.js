const JSVM = require('../src/vm');
class Example {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.secret = Math.random();
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
    VM.loadFromString('789c63ef63606060625463606060603c0522183f8248b13eb58ff26a6aa7c03c26188fa3ef419f70491f3348134b72624e8e685f491f3b4233034433579f5a899af03d356d00981e14c6', 'hex');
    VM.loadDependencies({ 224: Example });
    VM.run();
    return VM.registers[222];
}
console.log(evaluate());