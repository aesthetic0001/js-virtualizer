const Pass = require("../utils/Pass");
const {shuffle} = require("../utils/random");
const {opcodes, opNames} = require("../utils/constants");



function removeUnusedOpcodes(VMChunk) {
    const usedOps = new Set()
    const vmAST = VMChunk.vmAST

    VMChunk.code.forEach(opcode => {
        usedOps.add(opcode.name)
    })

    VMChunk.setMetadata({
        usedOpnames: usedOps
    })

    const newOpnames = Array.from(usedOps)

    // fill with NOP
    for (let i = 0; i < opNames.length - newOpnames.length; i++) {
        newOpnames.push("NOP")
    }

    shuffle(newOpnames)

    const remapped = {}

    for (let i = 0; i < newOpnames.length; i++) {
        if (usedOps.has(newOpnames[i])) {
            remapped[newOpnames[i]] = i
        }
    }

    VMChunk.code.forEach(opcode => {
        opcode.opcode = Buffer.from([remapped[opcode.name]])
    })

    const opcodesArrayExpression = vmAST.body[2].declarations[0].init

    opcodesArrayExpression.elements = []

    for (let i = 0; i < newOpnames.length; i++) {
        opcodesArrayExpression.elements.push({
            type: "Literal",
            value: newOpnames[i],
            raw: `"${newOpnames[i]}"`
        })
    }
}

const RemoveUnused = new Pass('Remove Unused Opcodes', removeUnusedOpcodes, 0);

module.exports = RemoveUnused
