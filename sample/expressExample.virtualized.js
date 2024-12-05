const express = require('express');
const JSVM = require('../src/vm');
function main() {
    const VM = new JSVM();
    VM.loadFromString('eJy1U79v00AUvlxNsQhQReJk6wToEIqM4koZ3lJ1sYhCYYIFicWLQ65JwPWF2LnCH5LhBv6BTh4ysISVyUsG/oGMVuZIlaogX5ISJCqVSizvfrz3vu/u0/dMiRBC2NMREEKl8g9ZkmQmsUSo/I1M5B5C6KVR5IyYR21LTcHUlZjqrrzYGylC6O4rHoaCvRODsP3EBpo6lOZlBVN46D2/t1wuv0sPJ9PSlJxp1K5G3QlFx1Lzq0BrLz4HJ/2Qs6DfZ2EvTnjUizosSFg3SfqH9Xoo3gdhV8TJoeOnExuov6adb2i/Sg/h+YScF6z4p2a99WnIB18sVQNyoFY3Se+Ex5Y6AOIqALcKUCnu97Qud4gLuux2SyRJyGPSXL0YYaVj8e4SaYCuRk+VC1WlKgohXFqJ1x/GXYs2Nv/MdVeq/+kXkTmZ6ztZ1tTHB0wcsxbnAyYilnQ5Ow3C0Blnvg352MnztEyhATdBNjfIN0N79Db4yJmIOGuL02if9YM4Zr2EBQMxjNo25P4l3spQj6kLVUorhUBEU+yuJCTNdcUz6gJx6Vq5rXL+/5Qr/Ne6Frz5WrATMeDMyfx/YlguLxbbczO6yuLGB9GLLL+RmpoVZzo/1vlFsd1ndpotnCwbl/20kW6N1mjt8Yu69HBthGsjciSNYqh3OjyxvJk0iwPGv61aMrRV67YE6gAoW8JZsZY9ObtW6/36egTeHDc4H2zhHP2Js7sa179D2RIm67bzy7Zf/FcXDQ==', 'base64');
    VM.loadDependencies({
        199: express,
        237: console
    });
    VM.run();
    return VM.registers[160];
}
main();