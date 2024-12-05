const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJylj7Fqw0AMhnW2CYYMcQRHnO2gBG8NGQolhgRaaJdO6hPc3xzt4MTEcbp4zpvkwfoYHcvZrSl0CVTDL4SkX58U1AwYg4juIq+Dyu425XbCZ8S+piBuNSEiNWScoQUjIuIQ6w9qQwt0Lu16WJSvE1l1u0HAvYOKvMPo2RXupXYb826Lo1um4CRjjlNw7vNQsIIC/TDdasn9sfnlbLr5L0nTk2TIm1DWn92bVwyZMY+91UMkRJQ8Vs7WrjL1m92ZxfWNhnjcrO1On9zh0LXKyrj90RamLr/H9Al/MdVvzBR86knuvwDaVUug', 'base64');
    VM.loadDependencies({
        62: console,
        164: Math
    });
    VM.run();
    return VM.registers[223];
}
evaluate();