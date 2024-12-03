const JSVM = require('../src/vm');
const a = [
    1,
    2,
    3,
    4,
    5
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyzsPO2XGFnZbLCesUKJRMTfhMGBoZ4lh0MDAzMOfnpYr57dnCAOExMMQwgio2BgYGRJYiBgYHbLb9IIT9NISc/v0B8R0yQSkwMm/iOmBUgmtt3x54dfP///19pY+dtYWeHYcNBom3IzCNggx0AGOQ1/Q==', 'base64');
    VM.loadDependencies({
        75: a,
        188: console
    });
    VM.run();
    return VM.registers[153];
}
evaluate();