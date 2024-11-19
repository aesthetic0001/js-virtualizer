const {VMChunk, Opcode, encodeDWORD, encodeFloat, encodeString} = require("./assembler");
const crypto = require("crypto");
const {registerNames} = require("./constants");

class BytecodeValue {
    constructor(type, value, register) {
        this.type = type;
        this.value = value;
        this.register = register;
    }

    getLoadOpcode() {
        let encoded
        switch (this.type) {
            case 'BYTE': {
                encoded = this.value;
                break;
            }
            case 'DWORD': {
                encoded = encodeDWORD(this.value);
                break;
            }
            case 'FLOAT': {
                encoded = encodeFloat(this.value);
                break;
            }
            case 'STRING': {
                encoded = encodeString(this.value);
                break;
            }
        }
        return new Opcode(`LOAD_${this.type}`, this.register, encoded);
    }
}

class FunctionBytecodeGenerator {
    constructor(ast, chunk) {
        this.ast = ast;
        this.chunk = chunk || new VMChunk();
        this.registeredValues = {};
        this.reservedRegisters = new Set()
        this.outputRegister = this.randomRegister();
    }

    randomRegister() {
        let register = crypto.randomInt(registerNames.length, 256);
        while (this.reservedRegisters.has(register)) {
            register = crypto.randomInt(registerNames.length, 256);
        }
        this.reservedRegisters.add(register);
        return register;
    }

    // generate bytecode for all converted values
    generate(block) {
        block = block || this.ast
    }

    getBytecode() {
        return this.chunk.toBytes();
    }
}

module.exports = {
    FunctionBytecodeGenerator
};
