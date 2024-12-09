const JSVM = require('../src/vm_dev');
function evaluate(a) {
    const VM = new JSVM();
    VM.loadFromString('eJytkbFKxEAQQCdrIodRCFGRu2rFIqRasqWdjYi93YKkOC5HjsuRxO/xH7ZR7PIJV1hudz+xjScz0eM0JwS1GWZ3Zt5jGGYAwOGrZxOuAJxHF997s2IyFNIMqMgUAADLMXc1AOynfFrxZGSUjpXKfWGkYdgKZ02bHFyIxkRChALAuSKAw02jQizeu+rTkUs1oCLT5IjIYTF3lxhja5extQ29PNLi10hpG2sd+bmSKgCAVwynJGL/JJI7RTMM3m/Bxwiej6d1Ni55wudF+YPGu2yC9frtKQBwXtrdDO32cSi46X8o+eVQSMyQyIngL9KqqrOyeJhkG/htH/jR9mTy3QHnxDjcapJ/4Hd2gCEx3KouFhvudR8ujXRwd+1de8yfpDuO2OF5720L2vY=', 'base64');
    VM.loadDependencies({
        50: console,
        184: a
    });
    VM.run();
    return VM.registers[238];
}
evaluate(1);
evaluate(2);
evaluate('passthrough');
evaluate('passthrough2');
evaluate('stop');