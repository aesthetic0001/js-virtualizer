const JSVM = require('../src/vm.js');
const {
    VMChunk,
    Opcode,
    encodeString,
    encodeFloat,
    encodeArray,
    encodeArrayRegisters,
    encodeDWORD
} = require("../src/utils/assembler");
const {registers} = require("../src/utils/constants");

const VM = new JSVM();
const chunk = new VMChunk();

const randFloat1 = Math.random() * 100;
const randFloat2 = Math.random() * 100;
const randInt1 = Math.floor(Math.random() * 100);
const randInt2 = Math.floor(Math.random() * 100);

chunk.append(new Opcode("LOAD_ARRAY", 2, encodeArrayRegisters([])));
chunk.append(new Opcode("LOAD_STRING", 3, encodeString("push")));
chunk.append(new Opcode("GET_PROP", 4, 2, 3));
chunk.append(new Opcode("LOAD_FLOAT", 0, encodeFloat(randFloat1)));
chunk.append(new Opcode("LOAD_FLOAT", 1, encodeFloat(randFloat2)));

chunk.append(new Opcode("ADD", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("SUBTRACT", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("MULTIPLY", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("DIVIDE", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("MODULO", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("POWER", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("LOAD_DWORD", 0, encodeDWORD(randInt1)));
chunk.append(new Opcode("LOAD_DWORD", 1, encodeDWORD(randInt2)));

chunk.append(new Opcode("ADD", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("SUBTRACT", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("MULTIPLY", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("DIVIDE", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("MODULO", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

chunk.append(new Opcode("POWER", 5, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([5])));

const bytecode = chunk.toBytes().toString('base64')

VM.loadFromString(bytecode, "base64");
VM.run();

const results = VM.registers[2]

test('Float Addition', () => {
    expect(results[0]).toBe(randFloat1 + randFloat2);
});

test('Float Subtraction', () => {
    expect(results[1]).toBe(randFloat1 - randFloat2);
})

test('Float Multiplication', () => {
    expect(results[2]).toBe(randFloat1 * randFloat2);
});

test('Float Division', () => {
    expect(results[3]).toBe(randFloat1 / randFloat2);
});

test('Float Modulo', () => {
    expect(results[4]).toBe(randFloat1 % randFloat2);
})

test('Float Power', () => {
    expect(results[5]).toBe(Math.pow(randFloat1, randFloat2));
})

test('Int Addition', () => {
    expect(results[6]).toBe(randInt1 + randInt2);
})

test('Int Subtraction', () => {
    expect(results[7]).toBe(randInt1 - randInt2);
})

test('Int Multiplication', () => {
    expect(results[8]).toBe(randInt1 * randInt2);
})

test('Int Division', () => {
    expect(results[9]).toBe(randInt1 / randInt2);
})

test('Int Modulo', () => {
    expect(results[10]).toBe(randInt1 % randInt2);
})

test('Int Power', () => {
    expect(results[11]).toBe(Math.pow(randInt1, randInt2));
})
