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
    VM.loadFromString('789c635fc7c0c0c0c4b89a81818181310a4430768348b175abbb9557af8e02f398603c8e75e1eb84bfac63066962494eccc9115df7651d3b4233034433d7bad55f560bdf5fad0f0011a51903', 'hex');
    VM.loadDependencies({ 87: Example });
    VM.run();
    return VM.registers[223];
}
console.log(evaluate());