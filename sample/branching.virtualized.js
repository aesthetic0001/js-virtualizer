const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjXsHAwMBWlJiXkp8ruuLeCvZyBgYGBsb5YLIRRHCtKL9XLsxdzgxSyZyTny66QheijAlZGbMGAwMDf3BqTmpySWqKQlliTmmqlVj5fA3l+fMbxcrnc4NorhXluuVMK+wfMICB/AruFYorVvCDTFYBmy/gXpSaWJJapFCSkZinYKBnKvxnBS9cVswntbgYIpVaWJqYo1CSD1WjDwBmsjS2', 'base64');
    VM.loadDependencies({
        45: console,
        222: Math
    });
    VM.run();
    return VM.registers[252];
}
console.log(evaluate());