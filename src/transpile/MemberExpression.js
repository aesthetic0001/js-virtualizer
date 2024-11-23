const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue} = require("../utils/assembler");

function isNestedMemberExpression(node) {
    return node.object.type === 'MemberExpression' || node.property.type === 'MemberExpression'
}

// returns the register with the result of the expression
function resolveMemberExpression(node) {
    const {object, property, computed} = node;
    let objectRegister, propertyRegister
    let objectIsImmutable = false, propertyIsImmutable = false
    log(`Resolving member expression: ${object.type}.${property.type}`)

    if (object.type === 'MemberExpression' && isNestedMemberExpression(object)) {
        objectRegister = this.resolveMemberExpression(object);
        log(`Merged object result is at ${this.TLMap[objectRegister]}`)
    }

    if (property.type === 'MemberExpression' && isNestedMemberExpression(property)) {
        propertyRegister = this.resolveMemberExpression(property);
        log(`Merged property result is at ${this.TLMap[propertyRegister]}`)
    }

    if (!objectRegister) {
        switch (object.type) {
            case 'MemberExpression': {
                objectRegister = this.resolveMemberExpression(object);
                log(`Merged object result is at ${this.TLMap[objectRegister]}`)
                break;
            }
            case 'Identifier': {
                objectRegister = this.getVariable(object.name);
                objectIsImmutable = true
                log(`Loaded object: ${object.name} at register ${objectRegister}`)
                break;
            }
            case 'Literal': {
                const value = new BytecodeValue(object.value, this.getAvailableTempLoad());
                this.chunk.append(value.getLoadOpcode());
                objectRegister = value.register
                log(`Loaded object: ${object.value} at register ${objectRegister}`)
                break;
            }
            case 'BinaryExpression': {
                objectRegister = this.resolveBinaryExpression(object);
                break;
            }
            case 'CallExpression': {
                // todo: impl
            }
        }
    }

    if (!propertyRegister) {
        switch (property.type) {
            case 'MemberExpression': {
                propertyRegister = this.resolveMemberExpression(property);
                log(`Merged property result is at ${this.TLMap[propertyRegister]}`)
                break;
            }
            case 'Identifier': {
                if (computed) {
                    propertyRegister = this.getVariable(property.name);
                    propertyIsImmutable = true
                    log(`Loaded property: ${property.name} at register ${propertyRegister}`)
                } else {
                    log(new LogData('Treating non-computed identifier as literal', 'warn', false))
                    const value = new BytecodeValue(property.name, this.getAvailableTempLoad());
                    propertyRegister = value.register
                    this.chunk.append(value.getLoadOpcode());
                }
                break
            }
            case 'Literal': {
                const value = new BytecodeValue(property.value, this.getAvailableTempLoad());
                this.chunk.append(value.getLoadOpcode());
                propertyRegister = value.register
                log(`Loaded property: ${property.value} at register ${propertyRegister}`)
                break;
            }
            case 'BinaryExpression': {
                propertyRegister = this.resolveBinaryExpression(property);
                break;
            }
            case 'CallExpression': {
                break
            }
        }
    }

    const mergeTo = (objectIsImmutable) ? (propertyIsImmutable ? this.getAvailableTempLoad() : propertyRegister) : objectRegister
    this.chunk.append(new Opcode('GET_PROP', mergeTo, objectRegister, propertyRegister));
    const objectTL = this.TLMap[objectRegister]
    const propertyTL = this.TLMap[propertyRegister]
    const mergedTL = this.TLMap[mergeTo]

    log(`Prop result stored in ${mergedTL}`)

    if (objectTL && objectTL !== mergedTL) {
        this.freeTempLoad(objectRegister)
        log(`Freed ${objectTL}`)
    }

    if (propertyTL && propertyTL !== mergedTL) {
        this.freeTempLoad(propertyRegister)
        log(`Freed ${propertyTL}`)
    }

    return mergeTo
}

module.exports = resolveMemberExpression
