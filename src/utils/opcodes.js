const {registers} = require("./constants");
const {log, LogData} = require("./log");

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
        log(`Loading DWORD ${value} into register ${register}`)
        this.write(register, value);
    },
    LOAD_FLOAT: function () {
        const register = this.readByte(), value = this.readFloat();
        this.write(register, value);
    },
    LOAD_STRING: function () {
        const register = this.readByte(), value = this.readString();
        log(`Loading string ${value} into register ${register}`)
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
        log(`Calling function at register ${fn} with this at register ${funcThis} and args: ${args}`);
        const res = this.read(fn).apply(this.read(funcThis), args);
        log(`Function call result: ${res} => ${dst}`);
        this.write(dst, res);
    },
    FUNC_ARRAY_CALL: function () {
        const fn = this.readByte(), dst = this.readByte(),
            funcThis = this.readByte(), argsReg = this.readByte();
        const args = this.read(argsReg);
        log(`Calling function with arraycall convention at register ${fn} with this at register ${funcThis} and args: ${args}`);
        const res = this.read(fn).apply(this.read(funcThis), args);
        log(`Function call result: ${res} => ${dst}`);
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
    VFUNC_SETUP_CALLBACK: function () {
        const cur = this.read(registers.INSTRUCTION_POINTER);
        const fnOffset = this.readDWORD(),
            dest = this.readByte(),
            returnDataStore = this.readByte(),
            argArrayMapper = this.readArrayRegisters();
        const restoreRegisters = this.readArrayRegisters();
        restoreRegisters.push(registers.INSTRUCTION_POINTER);

        function cb(...args) {
            this.regstack.push([this.registers.slice(), returnDataStore]);
            for (let i = 0; i < args.length; i++) {
                this.write(argArrayMapper[i], args[i]);
            }
            this.registers[registers.INSTRUCTION_POINTER] = cur + fnOffset - 1;
            this.run()
            const res = this.read(returnDataStore);
            const [oldRegisters] = this.regstack.pop();
            for (const restoreRegister of restoreRegisters) this.registers[restoreRegister] = oldRegisters[restoreRegister];
            log(`Callback result: ${res}`)
            return res
        }

        this.write(dest, cb.bind(this));
    },
    VFUNC_RETURN: function () {
        const internalReturnReg = this.readByte();
        const restoreRegisters = this.readArrayRegisters();
        const retValue = this.read(internalReturnReg);
        const [oldRegisters, returnDataStore] = this.regstack.pop();

        restoreRegisters.push(registers.INSTRUCTION_POINTER);
        for (const restoreRegister of restoreRegisters) {
            this.registers[restoreRegister] = oldRegisters[restoreRegister];
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
            log(`Jumping to ${cur + offset - 1}`)
            this.registers[registers.INSTRUCTION_POINTER] = cur + offset - 1;
        }
    },
    JUMP_NOT_EQ: function () {
        const cur = this.read(registers.INSTRUCTION_POINTER);
        const register = this.readByte(), offset = this.readDWORD();
        if (!this.read(register)) {
            log(new LogData(`Jumping to ${cur + offset - 1}`, 'accent'))
            this.registers[registers.INSTRUCTION_POINTER] = cur + offset - 1;
        } else {
            log(new LogData(`Not jumping to ${cur + offset - 1}`, 'accent'))
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
        log(`Moving property ${this.read(prop)} from object to ${dest}`)
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
        log(`Comparing ${this.read(left)} (${left}) === ${this.read(right)} (${right}) => ${dest}`)
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

module.exports = implOpcode;
