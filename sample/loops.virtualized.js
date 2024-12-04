const JSVM = require('../src/vm');
const a = [
    1,
    3,
    5,
    7,
    9
];
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJyl1EGL00AUwPHXbMWSas2yi1EKEkMve1yCuLqtoAd9CLKLIs9rF+MaEpqyu+5XmG8wd2859OCnydlP4M2ToZF5aZtxZ5UBb0lofy/5wzyHAAB2U3LUhfsAUwoRPQTouPxoayhTCqX0JAC86fKjLD+9KwvqqZuOI5TgVOq6WwKA9y5N5vNkdhokwWQyCSKfRDkSoupLKmgAAAXLN3T52EbeeXEWT1MlTy9W+CMDf2tKjiHdepmfBVl8EWR5Pl8TPol0Q0XpoK6XP1oMN68lGROMKXJbx4KP+Sz2SVYjKUUfqaAx7R0QPZH0FOWhlCHiHZX3fpeF/WElRVhVnpLe8zMeVxWixz9wSh53wuPGAHDvSt9wPwwup9mX2BfleFSWJ/1KFEKl+NaMiPQRH2xGDM3QYfS3KUem6BhiXzVKZk3vleCLUrZSXS+/29T2NMmMfUB7V0vDL/73ll7hlU0FdxM6Mj76K5s3dfO1jXlbL/v4P1rmn/7dcmndciWZLZ1mNyyoQ52QyCNeCtgshQWuj+5RF9sDhz20XAq4PrdYYLRo1gI2a6G1j23sa9eCzg+ul8y14NLnJIubsCvAR7HQ37Oulz9t0gYtxWVd93mW8e053z/8I/Wz35gHfpU=', 'base64');
    VM.loadDependencies({
        41: a,
        168: console
    });
    VM.run();
    return VM.registers[216];
}
evaluate();