const registerNames = [
    "INSTRUCTION_POINTER",
    "STATUS",
    // for void functions/operations
    "VOID"
]

const reservedNames = new Set(registerNames)
reservedNames.delete("VOID")

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
    // [register, keys, values]
    "LOAD_OBJECT",

    // functions

    // - external functions -
    // [fn, dst, functhis (identity), ...args]
    "FUNC_CALL",

    // - internal functions (defined in bytecode) -
    // argmap should be a list of functionreg: argreg
    // [offset, return_data_store_external, ...argmap]
    "VFUNC_CALL",
    // scoped_regs is a list of registers that should not be restored as they are outside the scope of the function
    // [return_data_store_internal, ...scoped_regs]
    "VFUNC_RETURN",

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
    // [dest, [src]]
    "SET_REF",
    // [[object], prop, src]
    "SET_PROP",
    // [[object], props, srcs]
    "SET_PROPS",
    // [dest, [object], prop]
    "GET_PROP",
    // [external_ref, src]
    "WRITE_EXT",

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
    registerNames,
    reservedNames,
    registers,
    opNames,
    opcodes
}
