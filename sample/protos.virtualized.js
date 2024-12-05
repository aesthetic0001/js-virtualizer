const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJxj6mFgYGAQ1enhZ2BgsGK6x8DAwKiqo3OPBcRiK0rMS8nPFfd9d48DxGdg6gaT20CquH3vvbsn+viePe////9P9zxmYNJ5JyrdwwIykDknP1388e0eDhCHiQmi1xekiwVkgkBwak5qcklqikJZYk5pqpGVRM+9btV793w5EOYzMO0H2yLdzdgNk+Z+3HObKAs4HCEmww2W6LmnAzcBALSXRyo=', 'base64');
    VM.loadDependencies({
        219: console,
        238: Math
    });
    VM.run();
    return VM.registers[58];
}
evaluate();