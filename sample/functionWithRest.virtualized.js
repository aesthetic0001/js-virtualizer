const JSVM = require('../src/vm');
function random(...args) {
    const VM = new JSVM();
    VM.loadFromString('eJx1j7ENwzAMBClZBgwYCNLGCNJ7DHepUnuDNCHCHbwLPUJ20BQe4htVCkREhYpUzwP4z2dQIupe7+cFSYcCzjMRkZcyT8rXmVlGaNIzET08imGJEQHVygmDgZnI72aFHLPIPkHiT9eiIyPhpvdTzvmzqeuOuLpkp3sLJyvgagHIDLCRb6hrKDTUVxo39fWvv+G29AWOZ1Vi', 'base64');
    VM.loadDependencies({
        28: args,
        249: console
    });
    VM.run();
    return VM.registers[242];
}
random(1, 2, 3, 4, 5);