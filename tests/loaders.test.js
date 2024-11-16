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

chunk.append(new Opcode("LOAD_BYTE", 3, randByte));
chunk.append(new Opcode("LOAD_DWORD", 4, encodeDWORD(randInt)));
chunk.append(new Opcode("LOAD_FLOAT", 5, encodeFloat(randFloat)));
chunk.append(new Opcode("LOAD_STRING", 6, encodeString(randString)));
chunk.append(new Opcode("LOAD_ARRAY", 7, encodeArrayRegisters([])));

const bytecode = chunk.toBytes().toString('base64')
VM.loadFromString(bytecode, 'base64');
VM.run()

test('Load byte', () => {
    expect(VM.registers[3]).toBe(randByte);
})

test('Load dword', () => {
    expect(VM.registers[4]).toBe(randInt);
})

test('Load float', () => {
    expect(VM.registers[5]).toBe(randFloat);
})

test('Load string', () => {
    expect(VM.registers[6]).toBe(randString);
})

test('Load array', () => {
    expect(VM.registers[7]).toEqual([]);
})
