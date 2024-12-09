const JSVM = require('../src/vm_dev');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjecvAwMBWlJiXkp8r9lbgLcdUBgYGBqZzYHIvAwMDI/fbqQJTRX5PZQGpZM7JTxd7qw5RxoSsjIWbgYGBwy+/RKGkqDRVfOo5bpVz5/YycjMacHPDeNxvp6oTZQ4nyJy0xJxiJIMYyDGIFWSQAUwbE0iIfHMMUczB8BgTyBxGkVdvLQEQzVzH', 'base64');
    VM.loadDependencies({
        16: Math,
        39: console
    });
    VM.run();
    return VM.registers[234];
}
console.log(evaluate());
