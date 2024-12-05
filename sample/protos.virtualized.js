const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyFjrENwjAQRb+NkaJEKEoRkYIGKVE2oEeidMsIiMbi1rjmCm/gERgkJXN4BSM7AtHRfd29u/c1A0BvuQVw1QJAzdZKSdsxWJlC6AKAuid7Nnm8cXTfBy9VoXXMH7TJeZBo5xhNE8TLgc67lNKTCdr6fmG9utwa6iM5nog6AjBWZVes0FmnmoUVn1ybUnoZ/mjJc0HVL2pyBXOhx21gibNIaIg9/7kaWOyXfQO7hEI7', 'base64');
    VM.loadDependencies({ 145: console });
    VM.run();
    return VM.registers[171];
}
evaluate();