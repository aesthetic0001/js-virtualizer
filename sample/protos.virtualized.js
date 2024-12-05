const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJylkLFKxEAQhidrhHhZOQ4MpnBB4Y4wrYW9RHwAwSatHiIYD1y0sBPs7PIeAZsr9i2msEx5MOQpIrvJBc9C77QZfnZm/v/bEQwAECkWrdA8BIBLQQDgJUqRU9tjVDRBHCEADCJWqW+ft+5mN/uYUeCmhbQOorA6JqkSKYsQKaMDTnebpnlfMAiVdUFlmzg4opInRCNrMQ5cT6Cr1s4LF+zxSTlsmubDkj13ZFr3ZLon23NPxwlqihjXYNQ9o2uvJs/Jo4gp7fDf5gxCL/GNu9NrR2NMT2O+0VwnaNahEbndx8rkMcnqJ656leulZhAm83lpTxm7O3pft3wbsnMxvXp80LdP05ixSBBlSJzxL6tB4XTuatWepvCKTSxcuuzTD0/P/wlQ/wXAP5vdb/TzmFH1s59becjl', 'base64');
    VM.loadDependencies({ 90: console });
    VM.run();
    return VM.registers[216];
}
evaluate();