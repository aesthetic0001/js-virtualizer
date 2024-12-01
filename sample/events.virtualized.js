const JSVM = require("../src/vm");
const mineflayer = require('mineflayer');
function onLogin() {
    console.log('Logged in');
}
function main() {
    const VM = new JSVM();
    VM.loadFromString('eJxtjjFug0AQRYesY4wUpbChRRSpUqTjApnGRbpI2+MN2qDATsQu3Xa5gMUN8DU4Sy6yVQRrIkt2MxrN/Pf/ZxwA1m2hPqiJecdDBAAI7DzzaUQcO2STbGPo3bSVkjFHHk6SYJZA4OZ9AICnxOZDmucu4hbtjEW6O+gzZ33ANRcmuHBocbv3iZFoy8KUr2RiflrQi25rxyZ49UnasB4AHg41iS/diBdBzc4Nvf9/U2uCHkD8/t82nS5bVTTlzg37BK1Lrc0jjifcjj6c1SRjfrwRy6bej28kZaVkVqms0Fnq3KXN0XusSIky5qM3ubsyua9JVmrhErQ/Z37E5z8avWHd', 'base64');
    VM.loadDependencies({
        117: Math,
        131: onLogin,
        144: console,
        162: mineflayer
    });
    VM.run();
    return VM.registers[106];
}
main();
