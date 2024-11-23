const {opcodes} = require("./constants");

class Opcode {
    constructor(name, ...args) {
        this.name = name
        this.opcode = Buffer.from([opcodes[this.name]]);
        this.data = Buffer.concat(args.map((arg) => {
            if (Buffer.isBuffer(arg)) {
                return arg;
            }
            if (typeof arg === 'string') {
                return Buffer.from(arg);
            } else if (typeof arg === 'number') {
                return Buffer.from([arg]);
            } else {
                return Buffer.from(arg);
            }
        }));
    }

    toBytes() {
        return Buffer.concat([this.opcode, this.data]);
    }

    fromBytes(buffer) {
        this.opcode = buffer[0];
        this.data = buffer.slice(1);
    }

    toString() {
        return `${this.name} (${this.opcode.toString('hex')}): ${this.data.toString('hex')}`;
    }
}

class VMChunk {
    constructor() {
        this.code = [];
        this.hasCustomTerminator = false;
    }

    append(opcode) {
        this.code.push(opcode);
        if (opcode.name === 'END') {
            this.hasCustomTerminator = true;
        }
    }

    toBytes() {
        return !this.hasCustomTerminator ? Buffer.concat([...this.code.map(opcode => opcode.toBytes()), Buffer.from([opcodes.END])]) : Buffer.concat(this.code.map(opcode => opcode.toBytes()));
    }

    toString() {
        let IP = 0;
        const lines = this.code.map(
            (opcode) => {
                const line = `[IP: ${IP}] - ${opcode.toString()}`;
                IP += opcode.toBytes().length;
                return line;
            }
        );
        if (!this.hasCustomTerminator) {
            lines.push(`[IP: ${IP}] - END`);
        }
        const info = [
            `Total Operations: ${this.code.length + (!this.hasCustomTerminator ? 1 : 0)} | Total Bytes: ${this.toBytes().length}`
        ]
        return [...info, ...lines].join('\n');
    }
}

class BytecodeValue {
    constructor(value, register, type) {
        this.type = type || this.getBytecodeType(value);
        this.value = value;
        this.register = register;
    }

    getBytecodeType(Literal) {
        switch (typeof Literal) {
            case 'number': {
                return Number.isInteger(Literal) ? 'DWORD' : 'FLOAT';
            }
            case 'string': {
                return 'STRING';
            }
        }
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

function encodeFloat(float) {
    let sign = 0;
    if (float < 0) {
        sign = 1;
        float = -float;
    }
    let exponent = 0;
    let significand = float;
    if (float === 0) {
        return Buffer.alloc(8);
    }
    while (significand < 1) {
        significand *= 2;
        exponent--;
    }
    while (significand >= 2) {
        significand /= 2;
        exponent++;
    }
    exponent += 0x3ff;
    significand -= 1;
    let significandBin = significand.toString(2).substring(2).padEnd(52, '0');
    let binary = sign.toString() + exponent.toString(2).padStart(11, '0') + significandBin;
    let data = Buffer.alloc(8);
    for (let i = 0; i < 8; i++) {
        data[i] = parseInt(binary.substring(i * 8, (i + 1) * 8), 2);
    }
    return data;
}

function encodeDWORD(dword) {
    const buffer = Buffer.alloc(4);
    buffer[0] = (dword >> 24) & 0xFF;
    buffer[1] = (dword >> 16) & 0xFF;
    buffer[2] = (dword >> 8) & 0xFF;
    buffer[3] = dword & 0xFF;
    return buffer;
}

function encodeString(str) {
    const length = str.length
    const data = Buffer.from(str);
    return Buffer.concat([encodeDWORD(length), data]);
}

function encodeObject(obj) {
    // todo: implement
}

function encodeArray(array, offset) {
    const length = array.length;
    // register, value
    const references = []
    const dependencies = {}

    let register = offset + 1;
    for (let i = 0; i < length; i++) {
        const value = array[i];
        if (Buffer.isBuffer(value)) {
            // buffer to register
            const register = value.readUInt8(0);
            references.push(register);
            continue
        }
        switch (typeof value) {
            case 'string': {
                references.push(register);
                dependencies[register] = encodeString(value);
                break;
            }
            case 'number': {
                const encodedValue = Number.isInteger(value) ? encodeDWORD(value) : encodeFloat(value);
                references.push(register);
                dependencies[register] = encodedValue;
                break;
            }
            case 'object':
                // todo: handle later, need to encode object, preload references in advance
                break;
        }
        register++;
    }

    const lengthBuffer = encodeDWORD(length);
    const data = Buffer.concat(references);
    return {
        encoded: Buffer.concat([lengthBuffer, data]),
        dependencies
    }
}

function encodeArrayRegisters(array) {
    const length = array.length;
    const encoded = [
        Buffer.from([length])
    ]
    for (let i = 0; i < length; i++) {
        encoded.push(Buffer.from([array[i]]))
    }
    return Buffer.concat(encoded);
}

module.exports = {
    Opcode,
    VMChunk,
    BytecodeValue,
    encodeString,
    encodeFloat,
    encodeDWORD,
    encodeArray,
    encodeArrayRegisters
}
