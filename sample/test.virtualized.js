const JSVM = require('../src/vm');
function random() {
    const VM = new JSVM();
    VM.loadFromString('eJxjFmdgYGArSsxLyc8VEf8mzj6PgYGBgTEATLqACE7xed/mMYOUcZTkB5cUZeali4jPE2dHKGFgTIAoDJgXIJQfoAUAjOQPGw==', 'base64');
    VM.loadDependencies({ 246: Math });
    VM.run();
    return VM.registers[111];
}
console.log(random());