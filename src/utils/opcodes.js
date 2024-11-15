const {registers} = require("./constants");

const implOpcode = {
    LOAD_BYTE: function () {
        const register = this.readByte(), value = this.readByte();
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
    FUNC_CALL: function () {
        const src = this.readByte(), dst = this.readByte(),
            funcThis = this.readByte(), args = this.readArray();
        const res = this.read(this.read(src)).apply(this.read(funcThis), args);
        this.write(dst, res);
    },
    JUMP_UNCONDITIONAL: function () {
        const offset = this.readDWORD();
        const cur = this.read(registers.INSTRUCTION_POINTER);
        this.write(registers.INSTRUCTION_POINTER, cur + offset);
    },
    JUMP_EQ: function () {
        const register = this.readByte(), offset = this.readDWORD();
        if (this.read(register) === 0) {
            const cur = this.read(registers.INSTRUCTION_POINTER);
            this.write(registers.INSTRUCTION_POINTER, cur + offset);
        }
    },
    JUMP_NOT_EQ: function () {
        const register = this.readByte(), offset = this.readDWORD();
        if (this.read(register) !== 0) {
            const cur = this.read(registers.INSTRUCTION_POINTER);
            this.write(registers.INSTRUCTION_POINTER, cur + offset);
        }
    },
    TRY_CATCH: function () {
        const catchOffset = this.readDWORD(), finallyOffset = this.readDWORD();
        try {
            this.run();
        } catch (e) {
            const cur = this.read(registers.INSTRUCTION_POINTER);
            this.write(registers.INSTRUCTION_POINTER, cur + catchOffset);
        } finally {
            const cur = this.read(registers.INSTRUCTION_POINTER);
            this.write(registers.INSTRUCTION_POINTER, cur + finallyOffset);
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
    EQ: function () {
        const dest = this.readByte(), left = this.readByte(), right = this.readByte();
        this.write(dest, this.read(left) === this.read(right));
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
    NOP: function () {
    },
    END: function () {
        this.write(registers.STATUS, 0);
    },
    PRINT: function () {
        console.log(this.read(this.readByte()));
    }
};

module.exports = implOpcode;
