const JSVM = require('../src/vm');
function random() {
    const VM = new JSVM();
    VM.loadFromString('eJxVjT0OwjAMhR2iUrqiZGXpxsZZmDtUgFCk/qlk9Um4ng/gofKMkpJQFkvP+t73NALAfm6H+9gbbLBkAABF8Uo4FXLDOmAHP1797IanQcbyh4BaVpCYIli8Ond7GKRVt9tSqg4fy1KfRJaYipQqZOKvYeqczztqa9ChA5ZSJ63qvp3y5l/Dslyy//jm8weQOEwN', 'base64');
    VM.loadDependencies({
        49: Number,
        93: Math
    });
    VM.run();
    return VM.registers[155];
}
console.log(random());