const JSVM = require('../src/index.js');
const {VMChunk, Opcode, encodeString, encodeFloat} = require("../src/utils/assembler");

const VM = new JSVM();
const chunk = new VMChunk();

const results = {}

// for float operations
const randFloat1 = Math.random() * 100;
const randFloat2 = Math.random() * 100;

chunk.append(new Opcode("LOAD_FLOAT", 0, encodeFloat(randFloat1)));
chunk.append(new Opcode("LOAD_FLOAT", 1, encodeFloat(randFloat2)));
chunk.append(new Opcode("ADD", 0, 0, 1));
chunk.append(new Opcode("PRINT", 0));

// for int operations
const randInt1 = Math.floor(Math.random() * 100);
const randInt2 = Math.floor(Math.random() * 100);

chunk.append(new Opcode("LOAD_INT", 0, randInt1));
chunk.append(new Opcode("LOAD_INT", 1, randInt2));
chunk.append(new Opcode("SUBTRACT", 0, 0, 1));
chunk.append(new Opcode("PRINT", 0));


const bytecode = chunk.toBytes().toString('base64')

console.log(chunk.toString())

VM.loadFromString(bytecode, "base64");
VM.run();
