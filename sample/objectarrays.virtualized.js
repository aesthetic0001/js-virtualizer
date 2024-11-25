const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c858fa10ec2400c405b4ab6603966fb01483c66f2f4fd0063098604d9efc04df10f9d3c83db5f2d232d39020ad3ebeb35af6d25f404003c5591164bce38030085b8cc6419f6d802c03ac4b90df28c14add8791183c4963c3bd368cf21483bbed3be5613610623b68083c546f3c039b3d3ea87a8509051b747a9c546a3ba22bbc2458d28b36a26a743c18ac9279c30f90d3ca4f255b32f93dcf470d3e4264e13a7f4705afd10152a8e6d27640bd1f576d9492f7e207e1fd8683edafa1b51d4ffbddda717ef56dabf003ed257ea', 'hex');
    VM.loadDependencies({ 100: console });
    VM.run();
    return VM.registers[145];
}
console.log(evaluate());