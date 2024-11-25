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
    VM.loadFromString('eJyFkLFOAzEMhu0LBW5gqe4GlijqCBOMSCxhMQsDi+cTpBVS1ErpIXidm8Lap2Gt4hdBSelQTqhLoj+OP/+/FQGA8qtFQ9+EDACANh9nEZUAwMXjsndh2Xnz0HnfRhbNbGuKGNWx3vMbc21uzb3BlJ8xAEClUwpaJI1RJy+d9w1t/rAqzCy1/1/U5KB7Ohz3cvns1u++N6u5cZ+/ifK8O6NFhrGZyUd4693YzY62syobKZkAZ6WYKtzmYpvCVocwK+p0r2pJmFOnfxZoC0kKiSuVV9Y8uXXvXg8dt2yTtlZatjHfNTEyZhRqGmj6RVc/LzZ34A==', 'base64');
    VM.loadDependencies({
        177: object,
        215: console
    });
    VM.run();
    return VM.registers[168];
}
console.log(evaluate());