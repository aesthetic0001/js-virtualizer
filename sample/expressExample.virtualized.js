const express = require('express');
const JSVM = require('../src/vm');
function main() {
    const VM = new JSVM();
    VM.loadFromString('eJy1U8+L00AY/TJb12DVpdQ0AX8wIiWLLBRiD2GhF0X0NB4UpMfUzrbVNJMmKaunPbfHXEOPbe5z8pTL/guLf0L/gTnktFQybaWiC+uCl498M+9735tHnpoCAKCWrBkAKOX3qZJqtRSlAOXv2iQtFZC9Ho30Vi1ViwZJJKCzAl+aF7VhpNnczLKzAwB4UyIAUAqp19XFlKhFpyAuZ3I5EwPA3bfUdRn+yAK3+9QgPDY5z8uCTMmj5at7q9Uqmy/Rw6ky3VKXW2ntWmruNzosilwavjt5SWmwIw39kNJujcY0+KaLGdEuxPokGgxpqIsLotniBbHrhFSK8wNU1DuaTSTs9oZYa69fBUjIWrxN0ZpEouGZsEldiIoAQMraC38c9nXe3HqRy6lYKk6Kik3LTkzLasv2AWYnuENpgJmHoz7Fp47rmiMrMUg+MvM8LnPSJDdhVrfMN2N7/MH5QjHzKO6yU+8I+04Y4kGEnYCNva5B8uQXn7RCecJtUue8UhikyRX7awu19gZxyG2i2Xzj3A6c/j/nip+0cy16lTA8ZAHFppX804bV6jLfjUH1qhiUPrOBpyfNWJVbkSXvR/L+vPg8wkZsnZuWNSoncTPeSUp1k5TLxnyJZlU0q/4ZlX13EEbU+3tajDSbbEPbl2r3XNbTxeIqsc9ff3WGvkux4/t4zTzwetiJcD+K/ONGw2WfHLfPwujYTOKJQXiy0brYpno2XwJaTH5T+hMTXTi+', 'base64');
    VM.loadDependencies({
        83: express,
        166: console
    });
    VM.run();
    return VM.registers[129];
}
main();