const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJzjZ2BgMGA5w8DAwFaUmJeSnyveevIMB4jPwJQEJp0YGBgYuVvPnDwj+u6MPe////+vTnnHwPiO4x1YGqK0FaxoyjvGd6L171hAMsw5+eniZ3ZClDGBFUBMZGQBmSgQnJqTmlySmqJQlphTmmpkJfGu1Um1tTVJ4l1rPYjmPvNu5zsAs/gwEA==', 'base64');
    VM.loadDependencies({
        185: console,
        201: Math
    });
    VM.run();
    return VM.registers[48];
}
evaluate();