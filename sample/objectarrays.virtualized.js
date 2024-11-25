const JSVM = require('../src/vm');
const multiplier = 2;
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c858f310e83300c45635c81ba425923c6a88b25aed213502375a9d40370849cc1eae0fbf50c950d2962ea92e4ff7c3d7fd78a144280a94e28f660e010027649783566374e66744a698ddf21d9b51b8c6e8cbb3337e6201824380320dbd927c951845d5507854519a67d6ba3361ac8113ec071d02b4924da2a8f45d6823e675a619d702e5f8d78197692d780c149c24364ceaeaa83c2a20aa35d14ad103e5f8f8bdeb4f13dbd57d87a517ac794e4ac04f43fbbfcb26059683f7afd02f26d4658', 'hex');
    VM.loadDependencies({ 83: console });
    VM.run();
    return VM.registers[238];
}
console.log(evaluate());