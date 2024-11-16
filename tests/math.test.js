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

chunk.append(new Opcode("LOAD_ARRAY", 3, encodeArrayRegisters([])));
chunk.append(new Opcode("LOAD_STRING", 4, encodeString("push")));
chunk.append(new Opcode("GET_PROP", 5, 3, 4));
chunk.append(new Opcode("LOAD_FLOAT", 6, encodeFloat(randFloat1)));
chunk.append(new Opcode("LOAD_FLOAT", 7, encodeFloat(randFloat2)));
chunk.append(new Opcode("LOAD_DWORD", 8, encodeDWORD(randInt1)));
chunk.append(new Opcode("LOAD_DWORD", 9, encodeDWORD(randInt2)));

chunk.append(new Opcode("ADD", 10, 6, 7));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("SUBTRACT", 10, 6, 7));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("MULTIPLY", 10, 6, 7));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("DIVIDE", 10, 6, 7));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("MODULO", 10, 6, 7));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("POWER", 10, 6, 7));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));

chunk.append(new Opcode("ADD", 10, 8, 9));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("SUBTRACT", 10, 8, 9));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("MULTIPLY", 10, 8, 9));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("DIVIDE", 10, 8, 9));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("MODULO", 10, 8, 9));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));
chunk.append(new Opcode("POWER", 10, 8, 9));
chunk.append(new Opcode("FUNC_CALL", 5, registers.VOID, 3, encodeArrayRegisters([10])));

const bytecode = chunk.toBytes().toString('base64')

VM.loadFromString(bytecode, "base64");
VM.run();

const results = VM.registers[3]

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
