const JSVM = require('./functhis.js.vm.js');
function random() {
    const VM = new JSVM();
    VM.loadFromString('eJxjTLF/wAAGTPMYGBg4SvKDS4oy89J5+VLmKYJEGFjkwKQuAwMDIwffvJR5TCkMDAysxTmZyam8fPNSFEFcJmRVLDNBIswpcjO55eR0wTxWGI+DL2VeCtgq1uKCnMwSuD2MyCYwgfQwMM+D6YHZypybWAC3E0UHc4rcebj5/IUpAKIAJKY=', 'base64');
    VM.loadDependencies({ 207: Number });
    VM.run();
    return VM.registers[113];
}
console.log(random());