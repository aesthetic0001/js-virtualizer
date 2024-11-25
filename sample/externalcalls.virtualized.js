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
    VM.loadFromString('789c8d90b16ac3301445dfb39aa6467489ec218b50d77630aeb742a74e1d5e860eda4da2948248207193fc8cff208bc15f91b5a0aff15024ea40d22159044ff7dda37bc5040030bbfc4cc48fc002000037fe18d6c80800eedf1795592d4aabde4a6bd3ba2059149b58d458b34bdebb5c3da967f5aa90fb6b74001049ce9d24e2ff5137d3d2da443467ac083d8bf5fb611a9cb847d9e52ce30fb3feb6955ace95d9fd35f2efbd2849945ddb2b0aac6462d695999d827a44d8186c575f9549a8a1501af010fc1c597b2cda362d7641dc075147987b31d55d2ebb6e1fa6db7e8a5b8d3ae54e4be70e3171f41fc88f99d167462932317a108fbfd14161e3', 'hex');
    VM.loadDependencies({
        177: object,
        211: console
    });
    VM.run();
    return VM.registers[33];
}
console.log(evaluate());