function sum(a,b) {
    const VM = new JSVM();VM.loadFromString('Dqb5Dja+GqamNg42nBympjYOG6Ym', 'base64');VM.loadDependencies({156:multiplier,190:b,249:a});VM.run();
    return VM.registers[27];
}
