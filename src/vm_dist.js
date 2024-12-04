// this is the VM class that can be copied as a standalone file to the target environment
const zlib = require("node:zlib");

const registerNames = [
    "INSTRUCTION_POINTER",
    "VOID"
]

const reservedNames = new Set(registerNames)
reservedNames.delete("VOID")

const registers = {}

for (let i = 0; i < registerNames.length; i++) {
    registers[registerNames[i]] = i
}

const opNames = [
    "LOAD_BYTE",
    "LOAD_BOOL",
    "LOAD_DWORD",
    "LOAD_FLOAT",
    "LOAD_STRING",
    "LOAD_ARRAY",
    "LOAD_OBJECT",
    "SETUP_OBJECT",
    "SETUP_ARRAY",
    "INIT_CONSTRUCTOR",
    "FUNC_CALL",
    "FUNC_ARRAY_CALL",
    "VFUNC_CALL",
    "VFUNC_RETURN",
    "JUMP_UNCONDITIONAL",
    "JUMP_EQ",
    "JUMP_NOT_EQ",
    "TRY_CATCH_FINALLY",
    "THROW",
    "SET",
    "SET_REF",
    "SET_PROP",
    "GET_PROP",
    "SET_INDEX",
    "GET_INDEX",
    "WRITE_EXT",
    "EQ_COERCE",
    "EQ",
    "NOT_EQ_COERCE",
    "NOT_EQ",
    "LESS_THAN",
    "LESS_THAN_EQ",
    "GREATER_THAN",
    "GREATER_THAN_EQ",
    "TEST",
    "TEST_NEQ",
    "ADD",
    "SUBTRACT",
    "MULTIPLY",
    "DIVIDE",
    "MODULO",
    "POWER",
    "AND",
    "BNOT",
    "OR",
    "XOR",
    "SHIFT_LEFT",
    "SHIFT_RIGHT",
    "NOT",
    "NEGATE",
    "PLUS",
    "INCREMENT",
    "DECREMENT",
    "TYPEOF",
    "VOID",
    "DELETE",
    "GET_ITERATOR",
    "ITERATOR_NEXT",
    "ITERATOR_DONE",
    "ITERATOR_VALUE",
    "GET_PROPERTIES",
    "NOP",
    "END",
    "PRINT"
]

const opcodes = {}

for (let i = 0; i < opNames.length; i++) {
    opcodes[opNames[i]] = i
}

const implOpcode = {
    LOAD_BYTE: function () {
        const register = this.readByte(), value = this.readByte();
        this.write(register, value);
    },
    LOAD_BOOL: function () {
        const register = this.readByte(), value = this.readBool();
        this.write(register, value);
    },
    LOAD_DWORD: function () {
        const register = this.readByte(), value = this.readDWORD();
        this.write(register, value);
    },
    LOAD_FLOAT: function () {
        const register = this.readByte(), value = this.readFloat();
        this.write(register, value);
    },
    LOAD_STRING: function () {
        const register = this.readByte(), value = this.readString();
        this.write(register, value);
    },
    LOAD_ARRAY: function () {
        const register = this.readByte(), value = this.readArray();
        this.write(register, value);
    },
    LOAD_OBJECT: function () {
        const register = this.readByte(), keys = this.readArray(), values = this.readArray();
        const obj = {};
        for (let i = 0; i < keys.length; i++) {
            obj[keys[i]] = values[i]
        }
        this.write(register, obj);
    },
    SETUP_OBJECT: function () {
        const register = this.readByte();
        this.write(register, {});
    },
    SETUP_ARRAY: function () {
        const register = this.readByte(), size = this.readDWORD();
        this.write(register, Array(size));
    },
    INIT_CONSTRUCTOR: function () {
        const register = this.readByte(), constructor = this.readByte(), args = this.readByte()
        this.write(register, new (this.read(constructor))(...this.read(args)));
    },
    FUNC_CALL: function () {
        const fn = this.readByte(), dst = this.readByte(),
            funcThis = this.readByte(), args = this.readArray();
        const res = this.read(fn).apply(this.read(funcThis), args);
        this.write(dst, res);
    },
    FUNC_ARRAY_CALL: function () {
        const fn = this.readByte(), dst = this.readByte(),
            funcThis = this.readByte(), argsReg = this.readByte();
        const args = this.read(argsReg);
        const res = this.read(fn).apply(this.read(funcThis), args);
        this.write(dst, res);
    },
    VFUNC_CALL: function () {
        const cur = this.read(registers.INSTRUCTION_POINTER);
        const offset = this.readDWORD(),
            returnDataStore = this.readByte(),
            argMap = this.readArrayRegisters();
        // store current register state for restoration
        this.regstack.push([this.registers.slice(), returnDataStore]);
        // convert current register positions (rel) to function necessary registers (abs)
        // (abs, rel, abs, rel, ...)
        for (let i = 0; i < argMap.length; i += 2) {
            this.write(argMap[i], this.read(argMap[i + 1]));
        }
        this.registers[registers.INSTRUCTION_POINTER] = cur + offset - 1;
    },
    VFUNC_RETURN: function () {
        const internalReturnReg = this.readByte();
        const scopedRegs = this.readArrayRegisters();
        const retValue = this.read(internalReturnReg);
        const [registers, returnDataStore] = this.regstack.pop();
        const doNotRestore = new Set(scopedRegs);
        for (let i = 0; i < registers.length; i++) {
            if (doNotRestore.has(i)) continue;
            this.registers[i] = registers[i];
        }
        this.write(returnDataStore, retValue);
    },
    JUMP_UNCONDITIONAL: function () {
        const cur = this.read(registers.INSTRUCTION_POINTER);
        const offset = this.readDWORD();
        this.registers[registers.INSTRUCTION_POINTER] = cur + offset - 1;
    },
    JUMP_EQ: function () {
        const cur = this.read(registers.INSTRUCTION_POINTER);
        const register = this.readByte(), offset = this.readDWORD();
        if (this.read(register)) {
            this.registers[registers.INSTRUCTION_POINTER] = cur + offset - 1;
        }
    },
    JUMP_NOT_EQ: function () {
        const cur = this.read(registers.INSTRUCTION_POINTER);
        const register = this.readByte(), offset = this.readDWORD();
        if (!this.read(register)) {
            this.registers[registers.INSTRUCTION_POINTER] = cur + offset - 1;
        }
    },
    TRY_CATCH_FINALLY: function () {
        const cur = this.read(registers.INSTRUCTION_POINTER);
        const errorRegister = this.readByte();
        const catchOffset = this.readDWORD(), finallyOffset = this.readDWORD();
        try {
            this.run();
        } catch (e) {
            this.write(errorRegister, e);
            this.registers[registers.INSTRUCTION_POINTER] = cur + catchOffset - 1;
            this.run();
        } finally {
            this.registers[registers.INSTRUCTION_POINTER] = cur + finallyOffset - 1
            this.run();
        }
    },
    THROW: function () {
        const errRegister = this.readByte();
        throw new Error(this.read(errRegister));
    },
    SET: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, src);
    },
    SET_REF: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, this.read(src));
    },
    WRITE_EXT: function () {
        const dest = this.readByte(), src = this.readByte();
        const ref = this.read(dest);
        ref.write(this.read(src));
    },
    SET_PROP: function () {
        const object = this.readByte(), prop = this.readByte(), src = this.readByte();
        const obj = this.read(object);
        obj[this.read(prop)] = this.read(src);
    },
    GET_PROP: function () {
        const dest = this.readByte(), object = this.readByte(), prop = this.readByte();
        this.write(dest, this.read(object)[this.read(prop)]);
    },
    SET_INDEX: function () {
        const array = this.readByte(), index = this.readByte(), src = this.readByte();
        this.read(array)[this.read(index)] = this.read(src);
    },
    GET_INDEX: function () {
        const dest = this.readByte(), array = this.readByte(), index = this.readByte();
        this.write(dest, this.read(array)[this.read(index)]);
    },
    EQ_COERCE: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) == this.read(right));
    },
    EQ: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) === this.read(right));
    },
    NOT_EQ_COERCE: function() {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) != this.read(right));
    },
    NOT_EQ: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) !== this.read(right));
    },
    LESS_THAN: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) < this.read(right));
    },
    LESS_THAN_EQ: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) <= this.read(right));
    },
    GREATER_THAN: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) > this.read(right));
    },
    GREATER_THAN_EQ: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) >= this.read(right));
    },
    TEST: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, !!this.read(src));
    },
    TEST_NEQ: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, !this.read(src));
    },
    ADD: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) + this.read(right));
    },
    SUBTRACT: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) - this.read(right));
    },
    MULTIPLY: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) * this.read(right));
    },
    DIVIDE: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) / this.read(right));
    },
    MODULO: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) % this.read(right));
    },
    POWER: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, Math.pow(this.read(left), this.read(right)));
    },
    AND: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) & this.read(right));
    },
    BNOT: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, ~this.read(src));
    },
    OR: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) | this.read(right));
    },
    XOR: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) ^ this.read(right));
    },
    SHIFT_LEFT: function () {
        const dest = this.readByte(), src = this.readByte(), shift = this.readByte();
        this.write(dest, this.read(src) << this.read(shift));
    },
    SHIFT_RIGHT: function () {
        const dest = this.readByte(), src = this.readByte(), shift = this.readByte();
        this.write(dest, this.read(src) >> this.read(shift));
    },
    NOT: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, !this.read(src));
    },
    NEGATE: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, -this.read(src));
    },
    PLUS: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, +this.read(src));
    },
    INCREMENT: function () {
        const dest = this.readByte();
        this.write(dest, this.read(dest) + 1);
    },
    DECREMENT: function () {
        const dest = this.readByte();
        this.write(dest, this.read(dest) - 1);
    },
    TYPEOF: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, typeof this.read(src));
    },
    VOID: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, void this.read(src));
    },
    DELETE: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, delete this.read(src));
    },
    GET_ITERATOR: function () {
        const dest = this.readByte(), src = this.readByte();
        this.write(dest, this.read(src)[Symbol.iterator]());
    },
    ITERATOR_NEXT: function () {
        const dest = this.readByte(), iterator = this.readByte();
        const next = this.read(iterator).next();
        this.write(dest, next);
    },
    ITERATOR_DONE: function () {
        const dest = this.readByte(), iterator = this.readByte();
        this.write(dest, this.read(iterator).done);
    },
    ITERATOR_VALUE: function () {
        const dest = this.readByte(), iterator = this.readByte();
        this.write(dest, this.read(iterator).value);
    },
    GET_PROPERTIES: function () {
        const dest = this.readByte(), src = this.readByte();
        const res = Object.getOwnPropertyNames(this.read(src))
        if (this.read(src) instanceof Array) {
            res.pop()
        }
        this.write(dest, res);
    },
    NOP: function () {
    },
    END: function () {
    },
    PRINT: function () {
        console.log(this.read(this.readByte()));
    }
};

class JSVM {
    constructor() {
        this.registers = new Array(256).fill(null)
        this.regstack = []
        this.opcodes = {}
        this.code = null
        this.registers[registers.INSTRUCTION_POINTER] = 0
        this.registers[registers.VOID] = 0
        Object.keys(opcodes).forEach((opcode) => {
            this.opcodes[opcodes[opcode]] = implOpcode[opcode].bind(this)
        })
    }

    read(register) {
        return this.registers[register]
    }

    write(register, value) {
        if (reservedNames.has(registerNames[register])) {
            throw new Error(`Tried to modify reserved register: ${registerNames[register]} (${register})`)
        }
        this.registers[register] = value
    }

    readByte() {
        const byte = this.code[this.read(registers.INSTRUCTION_POINTER)]
        this.registers[registers.INSTRUCTION_POINTER] += 1;
        return byte
    }

    readBool() {
        return this.readByte() === 1
    }

    readArrayRegisters() {
        const length = this.readByte()
        const array = []
        for (let i = 0; i < length; i++) {
            array.push(this.readByte())
        }
        return array
    }

    readArray() {
        const length = this.readByte()
        const array = []
        for (let i = 0; i < length; i++) {
            array.push(this.read(this.readByte()))
        }
        return array
    }

    readDWORD() {
        return this.readByte() << 24 | this.readByte() << 16 | this.readByte() << 8 | this.readByte()
    }

    readFloat() {
        let binary = "";
        for (let i = 0; i < 8; ++i) {
            binary += this.readByte().toString(2).padStart(8, '0');
        }
        const sign = (binary.charAt(0) === '1') ? -1 : 1;
        let exponent = parseInt(binary.substring(1, 12), 2);
        let significandBase = binary.substring(12);
        let significandBin;
        if (exponent === 0) {
            if (significandBase.indexOf('1') === -1) {
                return 0;
            } else {
                exponent = -0x3fe;
                significandBin = '0' + significandBase;
            }
        } else {
            exponent -= 0x3ff;
            significandBin = '1' + significandBase;
        }
        let significand = 0;
        for (let i = 0, val = 1; i < significandBin.length; ++i, val /= 2) {
            significand += val * parseInt(significandBin.charAt(i));
        }
        return sign * significand * Math.pow(2, exponent);
    }

    readString() {
        const length = this.readDWORD()
        let str = ''
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(this.readByte())
        }
        return str
    }

    loadFromString(code, format) {
        if (!format) {
            this.code = code
            return
        }
        const buffer = Buffer.from(code, format)
        if (buffer[0] === 0x78 && buffer[1] === 0x9c) {
            this.code = zlib.inflateSync(buffer)
        } else {
            this.code = buffer
        }
    }

    loadDependencies(dependencies) {
        Object.keys(dependencies).forEach((key) => {
            this.write(parseInt(key), dependencies[key])
        })
    }

    run() {
        while (true) {
            const opcode = this.readByte()
            if (opcode === undefined || opNames[opcode] === "END") {
                break
            }
            if (!this.opcodes[opcode]) {
                continue
            }
            try {
                this.opcodes[opcode]()
            } catch (e) {
                throw e
            }
        }
    }
}

module.exports = JSVM
