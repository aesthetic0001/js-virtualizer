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
    VM.loadFromString('eJyzWJZpKbrMykTUWlRUycSE34SBgWE5kyMDAwO7dLmoo1J5uUA5AwODF4soAwMDc05+upjjKVEOEIeRCSTBwFQCYrNYMDAw8DoVpSZmZ+alKySWKJiLi5ZbqJSXl3A7ip4S5WNgYPDHNIMJwwxut/wihfw0hZz8/AKYCeKi5aIIk/7//x9kBwDikCVd', 'base64');
    VM.loadDependencies({
        105: a,
        202: console
    });
    VM.run();
    return VM.registers[99];
}
evaluate();