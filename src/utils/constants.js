const registerNames = [
    "INSTRUCTION_POINTER",
    "STATUS",
]

const registers = {}

for (let i = 0; i < registerNames.length; i++) {
    registers[registerNames[i]] = i
}

const opNames = [
    // data loading
    // [register, value]
    "LOAD_BYTE",
    // [register, value]
    "LOAD_DWORD",
    // [register, value]
    "LOAD_FLOAT",
    // [register, value]
    "LOAD_STRING",
    // [register, value]
    "LOAD_ARRAY",

    // functions
    // [src, dst, functhis (identity), ...args]
    "FUNC_CALL",

    // branching
    // [offset]
    "JUMP_UNCONDITIONAL",
    // [register, offset]
    "JUMP_EQ",
    // [register, offset]
    "JUMP_NOT_EQ",
    // [catch_offset, finally_offset]
    "TRY_CATCH",
    // [err_register]
    "THROW",

    // memory
    // [dest, src]
    "SET",

    // comparison
    // [dest, left, right]
    "EQ",
    // [dest, left, right]
    "NOT_EQ",
    // [dest, left, right]
    "LESS_THAN",
    // [dest, left, right]
    "LESS_THAN_EQ",
    // [dest, left, right]
    "GREATER_THAN",
    // [dest, left, right]
    "GREATER_THAN_EQ",

    // arithmetic
    // [dest, left, right]
    "ADD",
    // [dest, left, right]
    "SUBTRACT",
    // [dest, left, right]
    "MULTIPLY",
    // [dest, left, right]
    "DIVIDE",
    // [dest, left, right]
    "MODULO",
    // [dest, left, right]
    "POWER",

    // bitwise
    // [dest, left, right]
    "AND",
    // [dest, left, right]
    "OR",
    // [dest, left, right]
    "XOR",
    // [dest, src, shift]
    "SHIFT_LEFT",
    // [dest, src, shift]
    "SHIFT_RIGHT",

    // misc
    "NOP",
    // none
    "END",
    // [register]
    "PRINT"
]

const opcodes = {}

for (let i = 0; i < opNames.length; i++) {
    opcodes[opNames[i]] = i
}

module.exports = {
    registers,
    opcodes
}
