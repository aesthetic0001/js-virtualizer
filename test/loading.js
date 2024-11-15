const JSVM = require('../src/index.js');
const {VMChunk, Opcode} = require("../src/utils/assembler");


const VM = new JSVM();
const chunk = new VMChunk();

const op = new Opcode("LOAD_STRING", 0, "Hello, World!");
chunk.append(op);

const op2 = new Opcode("PRINT", 0);
chunk.append(op2);

const bytecode = chunk.toBytes().toString('base64')

console.log(bytecode)

VM.loadFromString(bytecode, "base64");
VM.run();
