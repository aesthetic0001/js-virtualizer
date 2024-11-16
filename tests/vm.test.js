const JSVM = require('../src/vm.js');
const {VMChunk, Opcode, encodeString, encodeFloat, encodeArray, encodeArrayRegisters, encodeDWORD} = require("../src/utils/assembler");
const {registers} = require("../src/utils/constants");
const test = require("node:test");

const VM = new JSVM();
const chunk = new VMChunk();

// for float operations
const randFloat1 = Math.random() * 100;
const randFloat2 = Math.random() * 100;
chunk.append(new Opcode("LOAD_ARRAY", 2, encodeArrayRegisters([])));
chunk.append(new Opcode("LOAD_STRING", 3, encodeString("push")));
chunk.append(new Opcode("GET_PROP", 4, 2, 3));
chunk.append(new Opcode("LOAD_FLOAT", 0, encodeFloat(randFloat1)));
chunk.append(new Opcode("LOAD_FLOAT", 1, encodeFloat(randFloat2)));
chunk.append(new Opcode("ADD", 0, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([0])));

// for int operations
const randInt1 = Math.floor(Math.random() * 100);
const randInt2 = Math.floor(Math.random() * 100);
chunk.append(new Opcode("LOAD_DWORD", 0, encodeDWORD(randInt1)));
chunk.append(new Opcode("LOAD_DWORD", 1, encodeDWORD(randInt2)));
chunk.append(new Opcode("SUBTRACT", 0, 0, 1));
chunk.append(new Opcode("FUNC_CALL", 4, registers.VOID, 2, encodeArrayRegisters([0])));

const bytecode = chunk.toBytes().toString('base64')

console.log(chunk.toString())

VM.loadFromString(bytecode, "base64");
VM.run();

test('Float Addition', () => {
    expect(VM.registers[2][0]).toBe(randFloat1 + randFloat2);
});

test('Integer Subtraction', () => {
    expect(VM.registers[2][1]).toBe(randInt1 - randInt2);
});

