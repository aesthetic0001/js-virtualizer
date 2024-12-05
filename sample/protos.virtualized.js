const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJylkLFKA0EQhuc2J5xZJRfw8AYsFBIOt5nDwl5OhLSC1ZYaRBADihZCCsHOcqu8hW8QuGKeIA+z3cnunYex0ESb4Wdn5v+/HUEAAIkiUQtLPQC4EAgAQaYUerUxYIVD5j4DQDchVYTuuXM7ud5ljZGfFrlzELHTKeYqy/NYMmrco2K7qqr3EYFQugma1YndA5zRELHvLAaR7wn21dkFckQBHc96VVUtHNlzQ2ZtS2Zbsh3/dJSxxYR4BUbbMvr2cvIcA0wIiwb/bU7QsXre8Bt/qNcGx5gWx3zDucrYrIIjSrd/ODVlivn0JzC5DPYiCTpGy5A+/VGTv2TwdS10KZvn48vH+4ebp3FKHGfMuUTS9MtqFHtd+jqtjxMH8ToWPn2rTd8/OfsngPwLQHg6uVvr5ymxamc/AEF6i8w=', 'base64');
    VM.loadDependencies({ 91: console });
    VM.run();
    return VM.registers[69];
}
evaluate();