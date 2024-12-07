const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

// ALWAYS produces a mutable result, ownership is transferred to the caller
function resolveObjectExpression(node) {
    const {properties} = node

    log(`Resolving object expression: ${properties.map(kv => `${kv.type === "SpreadElement" ? `...${kv.argument.type}` : `${kv.key.type}: ${kv.value.type}`}`).join(', ')}`)

    const objectRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('SETUP_OBJECT', objectRegister));

    properties.forEach((kvPair) => {
        if (kvPair.type === 'SpreadElement') {
            this.resolveSpreadElement(kvPair, objectRegister)
        } else {
            const {computed, key, value} = kvPair
            const keyRegister = this.resolveExpression(key, {computed}).outputRegister,
                valueRegister = this.resolveExpression(value).outputRegister

            log(`Resolving object property: ${key.type} ${computed ? 'computed' : 'non-computed'}`)

            this.chunk.append(new Opcode('SET_PROP', objectRegister, keyRegister, valueRegister));
            if (needsCleanup(key) || !computed) this.freeTempLoad(keyRegister)
            if (needsCleanup(value)) this.freeTempLoad(valueRegister)
        }
    })

    return objectRegister
}

module.exports = resolveObjectExpression
