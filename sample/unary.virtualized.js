const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c63d1616060602b4acc4bc9cf15d339a9c321c9c0c0c0c0240b26f919181818b975244f4a8ae448b2805432e7e4a78be99c8528634256c67299818181c32fbf44a1a4a834555c52f6b28aac2c3fe36546fdcb97613c6e1dc9b34499c30932272d31a718c92006720c6205196400d3c6041222df1c431473303cc6043287512446c702003cef3bee', 'hex');
    VM.loadDependencies({
        201: Math,
        205: console
    });
    VM.run();
    return VM.registers[92];
}
console.log(evaluate());