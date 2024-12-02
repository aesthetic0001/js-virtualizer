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
    VM.loadFromString('eJyNkLFqwzAQhk9WUxdDp9Q22QQaO5RWm+HA0KlLBSEvYBq1FI4EEpf2MbLnQfIKeoxOmqzVc5FapykZmkXi5+6++//jHgA4LV9yv/UpAQBjNYRvEx6OAHD5sGjNatGQuG+ICqpR1vUm87QlfsL4xa24FncCBXOxrgAgkc4pieiOaWdPDVHu7TcuOcSxgOPDSFSjA4ClcX+So8nUrN+oFctnYT5+ooWtlZCI/T8BkyPc1aNZt2b+lzVQYsfoffXamhwtpr83AFZFRLkPXdoy1XFFF+uz2LsL9UJ3O9l1s6jOB5WV2urCKS2VqjJ0NtzT7c2zYJ5J3/vxp7/5AjgLe5Q=', 'base64');
    VM.loadDependencies({
        155: console,
        200: object
    });
    VM.run();
    return VM.registers[224];
}
console.log(evaluate());