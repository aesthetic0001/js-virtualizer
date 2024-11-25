const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveObjectExpression(node) {
    const {properties} = node

    log(`Resolving object expression: ${properties.map(kv => `${kv.key.type}: ${kv.value.type}`).join(', ')}`)

    const objectRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('SETUP_OBJECT', objectRegister));

    properties.forEach((kvPair) => {
        const {computed, key, value} = kvPair
        let keyRegister, valueRegister

        log(`Resolving object property: ${key.type} ${computed ? 'computed' : 'non-computed'}`)

        switch (key.type) {
            case 'Identifier': {
                if (computed) {
                    keyRegister = this.getVariable(key.name);
                    log(`Loaded property: ${key.name} at register ${keyRegister}`)
                } else {
                    log(new LogData('Treating non-computed identifier as literal', 'warn', false))
                    const literalValue = new BytecodeValue(key.name, this.getAvailableTempLoad());
                    keyRegister = literalValue.register
                    this.chunk.append(literalValue.getLoadOpcode());
                }
                break
            }
            case 'Literal': {
                const value = new BytecodeValue(key.value, this.getAvailableTempLoad());
                this.chunk.append(value.getLoadOpcode());
                keyRegister = value.register
                log(`Loaded property: ${key.value} at register ${keyRegister}`)
                break;
            }
            case 'MemberExpression': {
                keyRegister = this.resolveMemberExpression(key);
                break;
            }
            case 'BinaryExpression': {
                keyRegister = this.resolveBinaryExpression(key);
                break;
            }
            case 'CallExpression': {
                keyRegister = this.resolveCallExpression(key);
                break
            }
            case 'ObjectExpression': {
                keyRegister = this.resolveObjectExpression(key);
                break
            }
            case 'ArrayExpression': {
                keyRegister = this.resolveArrayExpression(key);
                break
            }
        }

        switch (value.type) {
            case 'Identifier': {
                valueRegister = this.getVariable(value.name);
                break
            }
            case 'Literal': {
                const tempRegister = this.getAvailableTempLoad();
                const literalValue = new BytecodeValue(value.value, tempRegister);
                this.chunk.append(literalValue.getLoadOpcode());
                valueRegister = literalValue.register
                break
            }
            case 'MemberExpression': {
                valueRegister = this.resolveMemberExpression(value);
                log(`Resolved member expression to register ${valueRegister}`)
                break;
            }
            case 'BinaryExpression': {
                valueRegister = this.resolveBinaryExpression(value);
                log(`Resolved binary expression to register ${valueRegister}`)
                break;
            }
            case 'CallExpression': {
                valueRegister = this.resolveCallExpression(value);
                log(`Resolved call expression to register ${valueRegister}`)
                break
            }
            case 'ObjectExpression': {
                valueRegister = this.resolveObjectExpression(value);
                log(`Resolved object expression to register ${valueRegister}`)
                break
            }
            case 'ArrayExpression': {
                valueRegister = this.resolveArrayExpression(value);
                log(`Resolved array expression to register ${valueRegister}`)
                break
            }
        }

        this.chunk.append(new Opcode('SET_PROP', objectRegister, keyRegister, valueRegister));
        if (needsCleanup(key) || !computed) this.freeTempLoad(keyRegister)
        if (needsCleanup(value)) this.freeTempLoad(valueRegister)
    })

    return objectRegister
}

module.exports = resolveObjectExpression
