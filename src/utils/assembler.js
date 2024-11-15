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
    }

    append(opcode) {
        this.code.push(opcode);
    }

    toBytes() {
        return Buffer.concat([...this.code.map(opcode => opcode.toBytes()), Buffer.from([opcodes.END])]);
    }

    toString() {
        return this.code.map(opcode => opcode.toString()).join("\n");
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

module.exports = {
    Opcode,
    VMChunk,
    encodeString,
    encodeFloat,
    encodeDWORD
}
