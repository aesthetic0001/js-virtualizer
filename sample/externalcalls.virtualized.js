const JSVM = require('../src/vm');
const object = {
    call: function (a, b) {
        console.log('External Call');
        return a + b;
    },
    write: function (value) {
        console.log('External Write');
        console.log(value);
        return value + 5;
    }
};
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('789c8d90b14ec3301086ef624a9a582c553230e0788609bc213131b120a56f10816991ac566a8382ba31f911fc0479aaeb4364cf826c4869d5812eb67edddd77ff7fcc010033cb59e6be5c9c0200620bfedbfa8711005c3c2d6abd5a54463e56c6e4694ba26db7894b3165278c8f6fe58dbc930f126da873008884b55c10d963dad94b654ce6ca1f5cb48f438f63c34850a303c0a438c9d1e554af3f4c2d976f527ffe46f35befa5202afe09181de1b267bdaef5eb216ba0848e51b37aaf754625c57f37006c02a2df85eecb3e56614517eaf3d0bbf1f55c751bd175f3a0ce0795f40a556eb9129c370959f4f7b43bf3e8cda370859b5cb9eb6f7a6d7928', 'hex');
    VM.loadDependencies({
        81: object,
        129: console
    });
    VM.run();
    return VM.registers[29];
}
console.log(evaluate());