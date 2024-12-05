const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyljr1qAlEQheeuiwQEf4qLa3chkW0WxcLGxiJFFsbO/sBFL0mxuriuNuNbWPsAPpJvkjLcNayBNIFMcYbhzJn5FGgI9EBE09Brs7Dbdb7p8wVPfqbgVumJiFSLcYEWdIioHXhbaYFOpIo2svy9L+d7Lgi4TqvQpztLl7lV6dbmaLODm0XgU8x8i8CJ7y3BGerB09aS+Efjv3Pp9L8kaU0SI0kbMv+kqp4ZMmTu+VMvoRBR961wtnSFKT/s1kxGUw3xuHHlDhZuv79beWHc7mAzU+bfa/qK35jqJ2YEvtYkr18Z3F4a', 'base64');
    VM.loadDependencies({
        147: console,
        157: Math
    });
    VM.run();
    return VM.registers[121];
}
evaluate();