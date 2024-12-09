const JSVM = require('../src/vm_dev');
const mineflayer = require('mineflayer');
function onLogin() {
    console.log('Logged in');
}
function main() {
    const VM = new JSVM();
    VM.loadFromString('eJxtjjFug0AQRYesY2wUpYgNNRKpkzukTpcT4A3aoMBOxK4vgLQlR3DNJdaVizlFfAAfYhXBGsuS04xGM//9/5kBgHmTy0+sY3M0IQEABHac3TAiQ0dig2yh8UM3pRSxIRMOkmCUQODGvQeA58R2fdZ1LjKW7Igt1Xajzpz1AbdcmNDEkaXV3icueVPkunhDHZvDhF51mzs2wLMvVJqdAOBhUyH/VjV/4VivXX/y/x9sdHAC4L+X22KrikbmdbF2/T4h6zJru8jQgVatD2cVitjs/ollQ+/HdxSilCItZZqrNHPu2mbnPWYoeRGb1pvc3ZjcVyhKOXEJ2acz39LrH43JgS0=', 'base64');
    VM.loadDependencies({
        18: onLogin,
        157: console,
        195: mineflayer,
        222: Math
    });
    VM.run();
    return VM.registers[93];
}
main();
