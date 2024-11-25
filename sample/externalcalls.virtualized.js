const JSVM = require('../src/vm');
const object = {
    call: function (a, b) {
        console.log('External Call');
        return a + b;
    },
    write: function (value) {
        console.log('External Write');
        console.log(value);
        return value + 5;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyNkLFqwzAURd+zmjSGdFCwhy5Cczu13gqdOmXp0MWQQWBatQSEw1Nc6jWDv6iLIfoK/4X/IkjEgSRDsgie7rtH94o5AGBm9ZO4hcMOAAC3/rjNkBEA3M3LStuyMPKtMCbNOhJdt41dhhm75J08yUf5LF8lcn+NCgAiwbkSRPwcdfNZGJO4/IQVoWexYT9MoyP3rLmc5f5Dr39NJVffUtf7Rv69FymImmt7RYGVvOt1pb+OQQMibIz+7LLSCeUUSgPWwc+R9Yeifd5jG8RNEG2EUy+mtp2Ktt2EaTxMcW/RplxZoVQdE0f/gfyQGX1mFK5xs3/3sAMCTXhW', 'base64');
    VM.loadDependencies({
        87: object,
        90: console
    });
    VM.run();
    return VM.registers[179];
}
console.log(evaluate());