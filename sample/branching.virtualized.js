const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxNjcEKgkAYhP9NKBDDRPTQaaPO5iWCXqBLt55gySEPm5KuPdb6AJ7+V/IJYhWiywzMfMx4TETLRlVF/Uo44BWIiISdtHTiMwLEAzxHerp+JhzN2OIf80YiCu/QeBgU8qN0h0sKO+6tLVPYwbnPiCDckBDTwpYZO+bQRYfpYXNtoAwaaUpVyTw7xz2vf216Q9vOFd6d0tLUMs9Occ/HLwdNNgg=', 'base64');
    VM.loadDependencies({
        12: Math,
        17: console
    });
    VM.run();
    return VM.registers[175];
}
console.log(evaluate());