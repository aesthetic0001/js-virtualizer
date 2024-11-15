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

const registerNames = [
    "INSTRUCTION_POINTER",
    "STATUS",
]

const opcodes = {}
const registers = {}

for (let i = 0; i < opNames.length; i++) {
    opcodes[opNames[i]] = i
}

for (let i = 0; i < registerNames.length; i++) {
    registers[registerNames[i]] = i
}

// compiler is expected to load all dependencies into registers prior to future execution

// a JSVM instance. a new one should be created for every virtualized function so that they are able to run concurrently without interfering with each other
class JSVM {
    constructor() {
        this.registers = {}
        this.opcodes = {}
        this.code = null
        this.registers[registers.INSTRUCTION_POINTER] = 0
        this.registers[registers.STATUS] = 1

        // implementation of opcodes
        this.opcodes[opcodes.LOAD_BYTE] = () => {
            const register = this.readByte(), value = this.readByte()
            this.write(register, value)
        }

        this.opcodes[opcodes.LOAD_DWORD] = () => {
            const register = this.readByte(), value = this.readDWORD()
            this.write(register, value)
        }

        this.opcodes[opcodes.LOAD_FLOAT] = () => {
            const register = this.readByte(), value = this.readFloat()
            this.write(register, value)
        }

        this.opcodes[opcodes.LOAD_STRING] = () => {
            const register = this.readByte(), value = this.readString()
            this.write(register, value)
        }

        this.opcodes[opcodes.LOAD_ARRAY] = () => {
            const register = this.readByte(), value = this.readArray()
            this.write(register, value)
        }

        this.opcodes[opcodes.FUNC_CALL] = () => {
            const src = this.readByte(), dst = this.readByte(),
                funcThis = this.readByte(), args = this.readArray()
            // call function
            const res = this.read(this.read(src)).apply(this.read(funcThis), args)
            this.write(dst, res)
        }
        this.opcodes[opcodes.JUMP_UNCONDITIONAL] = () => {
            const offset = this.readDWORD()
            const cur = this.read(registers.INSTRUCTION_POINTER)
            this.write(registers.INSTRUCTION_POINTER, cur + offset)
        }

        this.opcodes[opcodes.JUMP_EQ] = () => {
            const register = this.readByte(), offset = this.readDWORD()
            if (this.read(register) === 0) {
                const cur = this.read(registers.INSTRUCTION_POINTER)
                this.write(registers.INSTRUCTION_POINTER, cur + offset)
            }
        }

        this.opcodes[opcodes.JUMP_NOT_EQ] = () => {
            const register = this.readByte(), offset = this.readDWORD()
            if (this.read(register) !== 0) {
                const cur = this.read(registers.INSTRUCTION_POINTER)
                this.write(registers.INSTRUCTION_POINTER, cur + offset)
            }
        }

        this.opcodes[opcodes.TRY_CATCH] = () => {
            const catchOffset = this.readDWORD(), finallyOffset = this.readDWORD()
            try {
                this.run()
            } catch (e) {
                const cur = this.read(registers.INSTRUCTION_POINTER)
                this.write(registers.INSTRUCTION_POINTER, cur + catchOffset)
            } finally {
                const cur = this.read(registers.INSTRUCTION_POINTER)
                this.write(registers.INSTRUCTION_POINTER, cur + finallyOffset)
            }
        }

        this.opcodes[opcodes.THROW] = () => {
            const errRegister = this.readByte()
            throw new Error(this.read(errRegister))
        }

        this.opcodes[opcodes.SET] = () => {
            const dest = this.readByte(), src = this.readByte()
            this.write(dest, this.read(src))
        }

        this.opcodes[opcodes.EQ] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) === this.read(right))
        }

        this.opcodes[opcodes.NOT_EQ] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) !== this.read(right))
        }

        this.opcodes[opcodes.LESS_THAN] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) < this.read(right))
        }

        this.opcodes[opcodes.LESS_THAN_EQ] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) <= this.read(right))
        }

        this.opcodes[opcodes.GREATER_THAN] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) > this.read(right))
        }

        this.opcodes[opcodes.GREATER_THAN_EQ] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) >= this.read(right))
        }

        this.opcodes[opcodes.ADD] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) + this.read(right))
        }

        this.opcodes[opcodes.SUBTRACT] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) - this.read(right))
        }

        this.opcodes[opcodes.MULTIPLY] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) * this.read(right))
        }

        this.opcodes[opcodes.DIVIDE] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) / this.read(right))
        }

        this.opcodes[opcodes.MODULO] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) % this.read(right))
        }

        this.opcodes[opcodes.POWER] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, Math.pow(this.read(left), this.read(right)))
        }

        this.opcodes[opcodes.AND] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) & this.read(right))
        }

        this.opcodes[opcodes.OR] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) | this.read(right))
        }

        this.opcodes[opcodes.XOR] = () => {
            const dest = this.readByte(), left = this.readByte(), right = this.readByte()
            this.write(dest, this.read(left) ^ this.read(right))
        }

        this.opcodes[opcodes.SHIFT_LEFT] = () => {
            const dest = this.readByte(), src = this.readByte(), shift = this.readByte()
            this.write(dest, this.read(src) << this.read(shift))
        }

        this.opcodes[opcodes.SHIFT_RIGHT] = () => {
            const dest = this.readByte(), src = this.readByte(), shift = this.readByte()
            this.write(dest, this.read(src) >> this.read(shift))
        }

        this.opcodes[opcodes.NOP] = () => {}

        this.opcodes[opcodes.END] = () => {
            this.write(registers.STATUS, 0)
        }

        this.opcodes[opcodes.PRINT] = () => {
            console.log(this.read(this.readByte()))
        }
    }

    loadFromString(code, format) {
        switch (format) {
            case 'base64':
                this.code = Buffer.from(code, 'base64')
                break
            case 'hex':
                this.code = Buffer.from(code, 'hex')
                break
            default:
                this.code = Buffer.from(code)
        }
    }

    read(register) {
        return this.registers[register]
    }

    write(register, value) {
        this.registers[register] = value
    }

    readByte() {
        return this.code[this.read(registers.INSTRUCTION_POINTER++)]
    }

    readArray() {
        const length = this.readByte()
        const array = []
        for (let i = 0; i < length; i++) {
            array.push(this.readByte())
        }
        return array
    }

    // js integers are 32-bit signed
    readDWORD() {
        return this.readByte() << 24 | this.readByte() << 16 | this.readByte() << 8 | this.readByte()
    }

    // taken from: https://github.com/jwillbold/rusty-jsyc/blob/master/vm/vm.js#L403
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
                // exponent and significand are zero
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

    run() {
        while (this.read(registers.STATUS)) {
            const opcode = this.readByte()
            this.opcodes[opcode]()
        }
    }
}
