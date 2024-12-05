const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJztjDEKAjEQRf/GFUIWEYtgCksl59hDeAYbwctsOYcwN5liiun3FFNFElBvYGX3efz3HANAVN4DuDoBMGRV6Wt7JpUL0YEAhFh0Hhve3B+3IwXx/e2sFVxtO4lpNqsTSZBTmXe11icXOA1x4ZHfcgnsucvS5dYf/DcEtzYyLTZYYrEsQlPh8E/8NJFY9PN9AZZnpLA=', 'base64');
    VM.loadDependencies({ 10: console });
    VM.run();
    return VM.registers[186];
}
evaluate();