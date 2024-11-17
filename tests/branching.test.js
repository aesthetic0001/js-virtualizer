const JSVM = require('../src/vm.js');
const {
    VMChunk,
    Opcode,
    encodeString,
    encodeFloat,
    encodeArrayRegisters,
    encodeDWORD
} = require("../src/utils/assembler");

const VM = new JSVM();
const chunk = new VMChunk();

const randInt1 = Math.floor(Math.random() * 100);
const randInt2 = Math.floor(Math.random() * 100);

chunk.append(new Opcode("LOAD_DWORD", 3, encodeDWORD(randInt1)));
chunk.append(new Opcode("LOAD_DWORD", 4, encodeDWORD(randInt2)));
chunk.append(new Opcode("JUMP_UNCONDITIONAL", encodeDWORD(37)));
chunk.append(new Opcode("LOAD_STRING", 5, encodeString("This should not be loaded!")));
chunk.append(new Opcode("LOAD_STRING", 5, encodeString("This should be loaded!")));
chunk.append(new Opcode("GREATER_THAN", 6, 3, 4));
chunk.append(new Opcode("JUMP_EQ", 6, encodeDWORD(29)));
chunk.append(new Opcode("LOAD_STRING", 7, encodeString("<= was true!")));
chunk.append(new Opcode("JUMP_UNCONDITIONAL", encodeDWORD(22)));
chunk.append(new Opcode("LOAD_STRING", 7, encodeString("> was true!")));
chunk.append(new Opcode("JUMP_NOT_EQ", 6, encodeDWORD(28)));
chunk.append(new Opcode("LOAD_STRING", 8, encodeString("> was true!")));
chunk.append(new Opcode("JUMP_UNCONDITIONAL", encodeDWORD(23)));
chunk.append(new Opcode("LOAD_STRING", 8, encodeString("<= was true!")));
chunk.append(new Opcode("END"));

const bytecode = chunk.toBytes().toString('base64')
VM.loadFromString(bytecode, 'base64');
VM.run()

test('Unconditional Jump', () => {
    expect(VM.registers[5]).toBe("This should be loaded!");
})

test('Conditional Jump', () => {
    if (randInt1 > randInt2) {
        expect(VM.registers[7]).toBe("> was true!");
    } else {
        expect(VM.registers[7]).toBe("<= was true!");
    }
})

test('Conditional Jump (Negated)', () => {
    if (randInt1 <= randInt2) {
        expect(VM.registers[8]).toBe("<= was true!");
    } else {
        expect(VM.registers[8]).toBe("> was true!");
    }
})
