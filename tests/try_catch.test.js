const JSVM = require('../src/vm_dev.js');
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

chunk.append(new Opcode("TRY_CATCH_FINALLY", 3, encodeDWORD(69), encodeDWORD(97)));
chunk.append(new Opcode("LOAD_STRING", 4, encodeString("This should be loaded!")));
chunk.append(new Opcode("LOAD_STRING", 5, encodeString("Some error encountered!")));
chunk.append(new Opcode("THROW", 5));
chunk.append(new Opcode("LOAD_STRING", 6, encodeString("Catch block executed!")));
chunk.append(new Opcode("END"));
chunk.append(new Opcode("LOAD_STRING", 7, encodeString("Finally block executed!")));
chunk.append(new Opcode("END"));
chunk.append(new Opcode("LOAD_STRING", 8, encodeString("This should also be loaded!")));
chunk.append(new Opcode("END"));

const bytecode = chunk.toBytes().toString('base64')
VM.loadFromString(bytecode, 'base64');
VM.run()

test('Try Block', () => {
    expect(VM.registers[4]).toBe("This should be loaded!");
})

test('Catch Block', () => {
    expect(VM.registers[6]).toBe("Catch block executed!");
})

test('Finally Block', () => {
    expect(VM.registers[7]).toBe("Finally block executed!");
})

test('Error Block', () => {
    expect(VM.registers[3] instanceof Error).toBeTruthy();
    expect(VM.registers[3].message).toBe("Some error encountered!");
})

test('Outside Block', () => {
    expect(VM.registers[8]).toBe("This should also be loaded!");
})
