const {registers, opcodes, opNames, registerNames, reservedNames} = require("./utils/constants");
const implOpcode = require("./utils/opcodes");
const {log, LogData} = require("./utils/log");
const zlib = require("node:zlib");

// compiler is expected to load all dependencies into registers prior to future execution
// a JSVM instance. a new one should be created for every virtualized function so that they are able to run concurrently without interfering with each other
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
        // log(`Read byte (IP = ${registers.INSTRUCTION_POINTER - 1}): ${byte.toString(16)}`)
        return byte
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
            // these should be registers to loaded values
            array.push(this.read(this.readByte()))
        }
        log(`Read array of length ${length}: ${array}`)
        return array
    }

    // js integers are 32-bit signed
    readDWORD() {
        const dword = this.readByte() << 24 | this.readByte() << 16 | this.readByte() << 8 | this.readByte()
        log(`Read DWORD: ${dword}`)
        return dword
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
        log(`Read float: ${sign * significand * Math.pow(2, exponent)}`)
        return sign * significand * Math.pow(2, exponent);
    }

    readString() {
        const length = this.readDWORD()
        let str = ''
        for (let i = 0; i < length; i++) {
            str += String.fromCharCode(this.readByte())
        }
        log(`Read string of length ${length}: ${str}`)
        return str
    }

    loadFromString(code, format) {
        if (!format) {
            // assume buffer
            this.code = code
            return
        }
        const buffer = Buffer.from(code, format)
        if (buffer[0] === 0x78 && buffer[1] === 0x9c) {
            log(new LogData("Decompressing zlib compressed bytecode", 'accent', true))
            this.code = zlib.inflateSync(buffer)
        } else {
            this.code = buffer
        }
    }

    loadDependencies(dependencies) {
        Object.keys(dependencies).forEach((key) => {
            log(`Loading dependency to register ${key}: ${dependencies[key]}`)
            this.write(parseInt(key), dependencies[key])
        })
    }

    run() {
        while (true) {
            const opcode = this.readByte()
            if (opcode === undefined || opNames[opcode] === "END") {
                // treat as end
                log(`[IP = ${this.read(registers.INSTRUCTION_POINTER) - 1}]: End of execution`)
                break
            }
            if (!this.opcodes[opcode]) {
                log(`[IP = ${this.read(registers.INSTRUCTION_POINTER) - 1}]: Unknown opcode ${opcode}`)
                // treat as NOP
                continue
            }
            log(`[IP = ${this.read(registers.INSTRUCTION_POINTER) - 1}]: Executing ${opNames[opcode]}`)
            try {
                this.opcodes[opcode]()
            } catch (e) {
                log(`${e.toString()} at IP = ${this.read(registers.INSTRUCTION_POINTER)}`)
                throw e
            }
        }
    }
}

module.exports = JSVM
