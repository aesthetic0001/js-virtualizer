const JSVM = require('../src/index.js');
const {VMChunk, Opcode, encodeString, encodeFloat} = require("../src/utils/assembler");


const VM = new JSVM();
const chunk = new VMChunk();

chunk.append(new Opcode("LOAD_FLOAT", 0, encodeFloat(Math.PI)));
chunk.append(new Opcode("LOAD_FLOAT", 1, encodeFloat(Math.E)));
chunk.append(new Opcode("ADD", 0, 0, 1));
chunk.append(new Opcode("PRINT", 0));

const bytecode = chunk.toBytes().toString('base64')

console.log(chunk.toString())

VM.loadFromString(bytecode, "base64");
VM.run();
