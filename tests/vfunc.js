const JSVM = require('../src/vm.js');
const {
    VMChunk,
    Opcode,
    encodeString,
    encodeFloat,
    encodeArrayRegisters,
    encodeDWORD
} = require("../src/utils/assembler");
const {registers} = require("../src/utils/constants");

const VM = new JSVM();
const chunk = new VMChunk();

const randInt = Math.floor(Math.random() * 100);

chunk.append(new Opcode("LOAD_DWORD", 3, encodeDWORD(randInt)));
chunk.append(new Opcode("VFUNC_CALL", encodeDWORD(16), registers.VOID, encodeArrayRegisters([3, 3])));
chunk.append(new Opcode("END"));
chunk.append(new Opcode("PRINT", 3));
chunk.append(new Opcode("VFUNC_RETURN", registers.VOID));

const bytecode = chunk.toBytes(false).toString('base64')
console.log(chunk.toString())
VM.loadFromString(bytecode, 'base64');
VM.run()
