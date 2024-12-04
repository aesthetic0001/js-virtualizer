const JSVM = require('../src/vm');
const a = [
    1,
    3,
    5,
    7,
    9
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyFzT0KwkAQBeBnXDAQ/GnGsKQJIWfwFyxEtvAQG1KEIJEsiOfwBnMJjzJn2T6yAbG0m/fge7Pj997zwfij94UxSwPgFRGAWSaeCpGVALiqUE3vrl2LpjiESWQBIKrCrRyA+fnR1N2tb/P6mW9Tsq60tkqENC0AbP5spGT9DwzD0Cn+AqM55hHQCGR8GrC6uL5JmWxJJIlhzacPiL4upQ==', 'base64');
    VM.loadDependencies({
        25: console,
        178: a
    });
    VM.run();
    return VM.registers[199];
}
evaluate();