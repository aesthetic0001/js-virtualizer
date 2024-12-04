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
    "LOAD_BOOL",
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
    // [register, constructor_register, argsReg]
    "INIT_CONSTRUCTOR",

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
    // argmaparray should be a list of [1st argument destination, 2nd argument destination, ...]
    // [offset, dest, return_data_store_external, ...argmaparray]
    "VFUNC_SETUP_CALLBACK",
    // do_restore is an array of registers that should be restored after vfunc completion
    // for example, registers that held mapped arguments
    // [return_data_store_internal, ...do_restore]
    "VFUNC_RETURN",

    // branching
    // [offset]
    "JUMP_UNCONDITIONAL",
    // [register, [offset]]
    "JUMP_EQ",
    // [register, [offset]]
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
    "EQ_COERCE",
    // [dest, left, right]
    "EQ",
    // [dest, left, right]
    "NOT_EQ_COERCE",
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
    // [dest, src]
    "TEST",
    // [dest, src]
    "TEST_NEQ",

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
    // [dest, src]
    "BNOT",
    // [dest, left, right]
    "OR",
    // [dest, left, right]
    "XOR",
    // [dest, src, shift]
    "SHIFT_LEFT",
    // [dest, src, shift]
    "SHIFT_RIGHT",

    // other unary
    // [dest, src]
    "NOT",
    // [dest, src]
    "NEGATE",
    // [dest, src]
    "PLUS",
    // [src]
    "INCREMENT",
    // [src]
    "DECREMENT",
    // [dest, src]
    "TYPEOF",
    // [dest, src]
    "VOID",
    // [dest, src]
    "DELETE",

    // iterators
    // [dest, src]
    "GET_ITERATOR",
    // [dest, src]
    "ITERATOR_NEXT",
    // [dest, src]
    "ITERATOR_DONE",
    // [dest, src]
    "ITERATOR_VALUE",
    // [dest, src]
    "GET_PROPERTIES",
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

function binaryOperatorToOpcode(operator) {
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
        case '<': {
            return 'LESS_THAN';
        }
        case '<=': {
            return 'LESS_THAN_EQ';
        }
        case '>': {
            return 'GREATER_THAN';
        }
        case '>=': {
            return 'GREATER_THAN_EQ';
        }
        case '==': {
            return 'EQ_COERCE';
        }
        case '===': {
            return 'EQ';
        }
        case '!=': {
            return 'NOT_EQ_COERCE';
        }
        case '!==': {
            return 'NOT_EQ';
        }
        case '&' : {
            return 'AND';
        }
        case '~': {
            return 'BNOT';
        }
        case '|': {
            return 'OR';
        }
        case '^': {
            return 'XOR';
        }
        case '<<': {
            return 'SHIFT_LEFT';
        }
        case '>>': {
            return 'SHIFT_RIGHT';
        }
        default: {
            throw new Error(`Unknown operator ${operator}`)
        }
    }
}

function updateOperatorToOpcode(operator) {
    switch (operator) {
        case '++': {
            return 'INCREMENT';
        }
        case '--': {
            return 'DECREMENT';
        }
    }
}

function unaryOperatorToOpcode(operator) {
    switch (operator) {
        case '!': {
            return 'NOT';
        }
        case '-': {
            return 'NEGATE';
        }
        case '+': {
            return 'PLUS';
        }
        case 'typeof': {
            return 'TYPEOF';
        }
        case 'void': {
            return 'VOID';
        }
        case 'delete': {
            return 'DELETE';
        }
        default: {
            throw new Error(`Unknown unary operator ${operator}`)
        }
    }
}

// types which are not automatically dropped by the transpiler
// ie. all types that are not identifiers (variables) which still take up a register
const cleanupNecessary = new Set([
    "BinaryExpression",
    "CallExpression",
    "MemberExpression",
    "ObjectExpression",
    "ArrayExpression",
    "NewExpression",
    "UnaryExpression",
    "UpdateExpression",
    "Literal"
])

function needsCleanup(node) {
    console.assert(typeof node === 'object', "needsCleanup called with non-object")
    return typeof node === 'object' && node?.type && cleanupNecessary.has(node.type)
}

module.exports = {
    registerNames,
    reservedNames,
    registers,
    opNames,
    opcodes,
    binaryOperatorToOpcode,
    unaryOperatorToOpcode,
    updateOperatorToOpcode,
    needsCleanup
}
