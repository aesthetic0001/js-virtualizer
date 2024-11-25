const {registers} = require("./constants");
const {log} = require("./log");

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
        const register = this.readByte(), size = this.readByte();
        this.write(register, Array(size));
    },
    FUNC_CALL: function () {
        const fn = this.readByte(), dst = this.readByte(),
            funcThis = this.readByte(), args = this.readArray();
        log(`Calling function at register ${fn} with this at register ${funcThis} and args: ${args}`);
        const res = this.read(fn).apply(this.read(funcThis), args);
        this.write(dst, res);
    },
    FUNC_ARRAY_CALL: function () {
        const fn = this.readByte(), dst = this.readByte(),
            funcThis = this.readByte(), argsReg = this.readByte();
        const args = this.read(argsReg);
        log(`Calling function with arraycall convention at register ${fn} with this at register ${funcThis} and args: ${args}`);
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
        log(`Getting property ${this.read(prop)} from object`)
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
    },
    PRINT: function () {
        console.log(this.read(this.readByte()));
    }
};

module.exports = implOpcode;
