const {registers, opcodes} = require("./utils/constants");
const implOpcode = require("./utils/opcodes");

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
        Object.keys(opcodes).forEach((opcode) => {
            this.opcodes[opcodes[opcode]] = implOpcode[opcode].bind(this)
        })
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

module.exports = JSVM
