const JSVM = require('../src/vm_dev');
const a = [
    1,
    3,
    5,
    7,
    9
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyl1M+L00AUwPHXbMWSao2sOEpBYii97wvi+qOCHhSEsosimtsWjGvY0JR11/P7Fyb/gTchF/+F+U8878GbJ6GReWmbcWeVAW9JaD8v+cI8DwEAbiTo6Qv/DiUYEQUE0PH50dZQJhhJGUgAmHb5UV4c3pQl9vRNx1Na8Cp93RUAELw+yhaLbH4YZuFkMgljgUqMlKr6EkscAMBXli+Z8r6LvP3sOJ0daXl2ssLvWfgrW/Is6crz4jjM05MwL4rFmhCokg0VJ4O6Xv5oMdq8lmRMMabJ6yYWvi/mqUBZjaRUfcISH+N0F/GBxIckH0kZEV3TeW93WdgZVlJFVRVo6Q0/43FVqXr8A0/wuAMedwYAt871jXai8PMsP02FEmcjIQ76lSqVTvGtGRGbI965jBjaoaP4b1P2bNGzxL5ulM2b3itBKCFbqa6X311qB4Zkx97F6fnS8Iv/vWVWeOFSwd+Ejq2P/sLmZdN86WJeNcve/4+WxYd/t1w6t1xJdkuv2Q1j7GAnQgyQlwI1S2FM66O716X2wFGPHJcCrc8tlRSPm7VAzVpo7X0X+8K1YPKDiyV7LfhvP2Z52oRdAYLU2HzPul7+dEkbthSX9f2nec63n/j+7h+pn/wGhrZjpA==', 'base64');
    VM.loadDependencies({
        77: a,
        146: console
    });
    VM.run();
    return VM.registers[141];
}
evaluate();
