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

const randByte = Math.floor(Math.random() * 256);
const randInt = Math.floor(Math.random() * 100);
const randFloat = Math.random() * 100;
const randString = Math.random().toString(36).substring(2);

chunk.append(new Opcode("LOAD_BYTE", 0, randByte));
chunk.append(new Opcode("LOAD_DWORD", 1, encodeDWORD(randInt)));
chunk.append(new Opcode("LOAD_FLOAT", 2, encodeFloat(randFloat)));
chunk.append(new Opcode("LOAD_STRING", 3, encodeString(randString)));
chunk.append(new Opcode("LOAD_ARRAY", 4, encodeArrayRegisters([])));

const bytecode = chunk.toBytes().toString('base64')
VM.loadFromString(bytecode, 'base64');
VM.run()

test('Load byte', () => {
    expect(VM.registers[0]).toBe(randByte);
})

test('Load dword', () => {
    expect(VM.registers[1]).toBe(randInt);
})

test('Load float', () => {
    expect(VM.registers[2]).toBe(randFloat);
})

test('Load string', () => {
    expect(VM.registers[3]).toBe(randString);
})

test('Load array', () => {
    expect(VM.registers[4]).toEqual([]);
})
