const registerNames = [
    "INSTRUCTION_POINTER",
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
    // [register] : sets up an empty object {}
    "SETUP_OBJECT",
    // [register, size] : sets up an empty array of size
    "SETUP_ARRAY",

    // functions

    // - external functions -
    // [fn, dst, functhis (identity), ...args]
    "FUNC_CALL",
    // [fn, dst, functhis (identity), argsReg] : argsReg is a register that contains an array of arguments
    "FUNC_ARRAY_CALL",
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
    // [error_store_register, catch_offset, finally_offset]
    "TRY_CATCH_FINALLY",
    // [err_message_register]
    "THROW",

    // memory
    // [dest, src]
    "SET",
    // [dest, [src]]
    "SET_REF",
    // [[object], prop, src]
    "SET_PROP",
    // [[object], props, srcs]
    "GET_PROP",
    // [[array], index, src]
    "SET_INDEX",
    // [dest, [array], index]
    "GET_INDEX",
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

function operatorToOpcode(operator) {
    switch (operator) {
        case '+': {
            return 'ADD';
        }
        case '-': {
            return 'SUBTRACT';
        }
        case '*': {
            return 'MULTIPLY';
        }
        case '/': {
            return 'DIVIDE';
        }
        case '%': {
            return 'MODULO';
        }
        case '**': {
            return 'POWER';
        }
    }
}

// types which are not automatically dropped by the transpiler
// ie. all types that are not identifiers (variables) which still take up a register
const cleanupNecessary = new Set([
    "BinaryExpression",
    "CallExpression",
    "MemberExpression",
    "Literal"
])

function needsCleanup(node) {
    return typeof node === 'object' && node?.type && cleanupNecessary.has(node.type)
}

module.exports = {
    registerNames,
    reservedNames,
    registers,
    opNames,
    opcodes,
    operatorToOpcode,
    needsCleanup
}
