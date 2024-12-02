const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjrmdgYGArSsxLyc8VrRetZ1dlYGBgYPwAJveBCK56VVFV4Y2qzCCVzDn56aL13yHKmJCVMfswMDDwB6fmpCaXpKYolCXmlKZaial+8FH+8GGfmOqHjSCaq171uypTvf2zNDCQr99Yr1hfzw8yOR7TfEYM8yXDQMYqZBYrpBelJpakFimUZCTmKRjomcNsAtvACDKKUfhjPS8DA8Mlpnr7BwxgQD37TDHtY4Lal0SMwUpwg3NSi4shpuYXKaQWlibmKJTkY7eBWfhjvT4AkU5z+Q==', 'base64');
    VM.loadDependencies({
        21: Math,
        247: console
    });
    VM.run();
    return VM.registers[241];
}
console.log(evaluate());