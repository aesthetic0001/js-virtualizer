const JSVM = require('./switch.js.vm.js');
function evaluate(a) {
    const VM = new JSVM();
    VM.loadFromString('eJytksFKw0AQhv9o0oNG2qUVMZCwQi85NrccvUjx7llyKJtCaUoSnyVHn2DPghe3D+Et976FlZloqaZCUC/DzM7M9zP8a2sAFjYv2tsA1mNI9fEiU6O40gNu2gIA7Jry0ADoJXJeyMlYCxMIUfdjXWmbRjGUTXLixlJfxLEXA9Y1AyxoKTxq3ofiU6OuxICbtmENlzUU5eGaYqDUOlBKcuWwLD2NhVGBMW6/FpXwAbxSOGeho38Sig4KLSg4vwUPCbyczct0lsuJXGb5DzJOT/rb7duTD1jPzW2ab/swCtPuRkVfjCJiSkTJhNNVUhRlmmcPKt3Bb7vAz/Y2v30Gwl8xw90biv7Ab92AS2bYRZmtdtybLlxeaeHuGl877I+SAya2eM4784nELQ==', 'base64');
    VM.loadDependencies({
        151: console,
        191: a
    });
    VM.run();
    return VM.registers[230];
}
evaluate(1);
evaluate(2);
evaluate('passthrough');
evaluate('passthrough2');
evaluate('stop');