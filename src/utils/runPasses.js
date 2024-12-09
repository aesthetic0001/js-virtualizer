const RemoveUnused = require("../postTranspilation/removeUnusedOpcodes");
const {log} = require("./log");

const passes = [RemoveUnused]

passes.sort((a, b) => a - b)

function runPasses(VMChunk) {
    passes.forEach(pass => {
        log(`Running pass: ${pass}`)
        pass.run(VMChunk)
    })
}

module.exports = runPasses
