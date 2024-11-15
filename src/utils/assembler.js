const {opcodes} = require("./constants");

class Opcode {
    constructor(name, ...args) {
        this.name = name
        this.opcode = opcodes[this.name];
        this.data = Buffer.concat(args.map(
            typeof args[0] === "string" ? arg => Buffer.from(arg, "utf-8") : arg => Buffer.from([arg])
        ));
    }

    toBytes() {
        return Buffer.concat([Buffer.from([this.opcode]), this.data]);
    }

    fromBytes(buffer) {
        this.opcode = buffer[0];
        this.data = buffer.slice(1);
    }

    toString() {
        return `${this.name}: ${JSON.stringify(this.data, null, 2)}`;
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

module.exports = {
    Opcode,
    VMChunk
}
