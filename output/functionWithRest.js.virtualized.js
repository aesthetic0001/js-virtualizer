const JSVM = require('./functionWithRest.js.vm.js');
function random(...args) {
    const VM = new JSVM();
    VM.loadFromString('eJx1jzEOgzAMRR1CqtKFL1Y2hgw9BJJXJHoGL1aXKr1GjtIb9GLsoFjNwNDp+0n+398dE5F/vZ8tEvcFXBQioqhlHlg+k4iO4MSBiB4RxXDPGR2qVRJ6AzNRXM0KXSbVdYDmn25FR0HCha+3fd+/Mzu/5M0lOx0snKyAqwWgEyBGzYn8idoThUrjzE3962+4LR2tWism', 'base64');
    VM.loadDependencies({
        110: console,
        168: args
    });
    VM.run();
    return VM.registers[48];
}
random(1, 2, 3, 4, 5);