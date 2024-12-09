const JSVM = require('./loops.js.vm.js');
const a = [
    1,
    3,
    5,
    7,
    9
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyl1M2K01AUwPGTjhJJ/GhxGqYINpPuuhuKzKoLXSgIMhNF0m3BOIYJTRlHHyLvkIWrO0vfYJ7kgHA3XZ2dK6GRe9I217mjXHCXhPZ3kj/c4xIAwJ2SXHXhPcSSfMQ+AjgeP9rbFyX5QvQFALwZ8aO8OHsqYhqoG8eVSnArdT1KAKD77jxbLrPFWZiF0+k0nAQkk0jKaigopjEAXLF8V5dPbeTHLy7S+bmS55cb/JmBvzWljiHdf1lchHl6GeZFsdwSAclyRznluK7X1GK4ey3BmGRMkT0dCz8UizQgUUVCyCFSTB2qe0T3BD1C0RXCRzxUeQcjFo72KyH9quor6T0/43FVLAf8AzfhcTMedw0ABzf6RkdR+HWef0kDmVxHSTIbVjKWKsX3ZsREHzGzGfHEDB1N/jblxBQ7huirRtmi6b0RApmIVqrr9Q+b2l1NMmP3qL5ZGn7xv/f0Cq9sKni70BPjo7+x6ermaxvzgV72+D9aFh//3XJt3XIjmS3dZjes6IAcn6hPvBSwWQor3B7dkxG2Bw4HaLkUcHtuMUZn1awFbNZCa5/a2LeuBZ0f3y6Za8FLPmV52oTdAAHKlf6edb3+aZM2bCku63nP85xvP/P94R+pfwPCNrtH', 'base64');
    VM.loadDependencies({
        81: console,
        255: a
    });
    VM.run();
    return VM.registers[241];
}
evaluate();