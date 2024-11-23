const JSVM = require('../src/vm');
const object = {
    call: function (a, b) {
        console.log('External Call');
        return a + b;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJw1zrEKwjAYBOD7Gw0uUmgmM0gmF4egQwdBMji5Ck6ZilSX0IJW8MV8i2x9jqwdmkUCdr7ju2MaAHPto9CjZgOA5bnp6mdTOXWqnOM6Eg0sTq04RhYALHZqq/bqqMgAIBIAMmmMkCEYHg1RYCmZ3SrnCnM1tE4E9QDm3AjK1n1eCiYmWIyCeQCrS/16u061d1V//keScVDS+5ILS+TJpk1pS5t/7eYHRGcvjw==', 'base64');
    VM.loadDependencies({
        85: object,
        250: console
    });
    VM.run();
    return VM.registers[181];
}
console.log(evaluate());