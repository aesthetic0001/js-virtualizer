const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxjamRgYGAQvdXIz8DAYMW0koGBgVH11q2VLF4MDAxsRYl5Kfm54h9LvDhAfAamLDB5HqSK+6NXiZdov5c97////0839jMw3SoRjWtkARnInJOfLt4/tZEDxGFiguj9CNLFAjJBIDg1JzW5JDVFoSwxpzTVyEqi0StL1cvrIwfCfAamGWBb4rIYs2DS3P2NU4mygMMRYjLcYIlGr1twEwCEGj3a', 'base64');
    VM.loadDependencies({
        116: Math,
        149: console
    });
    VM.run();
    return VM.registers[45];
}
evaluate();