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

    log(`Resolving MemberExpression: ${object.type}.${property.type}`)

    if (object.type === 'MemberExpression' && isNestedMemberExpression(object)) {
        objectRegister = this.resolveMemberExpression(object);
        log(`Object result is at ${this.TLMap[objectRegister]}`)
    }

    if (property.type === 'MemberExpression' && isNestedMemberExpression(property)) {
        propertyRegister = this.resolveMemberExpression(property);
        log(`Property result is at ${this.TLMap[propertyRegister]}`)
    }

    if (!objectRegister) {
        switch (object.type) {
            case 'Identifier': {
                objectRegister = this.getVariable(object.name);
                objectIsImmutable = true
                log(`Loaded object: ${object.name} at register ${objectRegister}`)
                break;
            }
            // these do not need to be cleaned up internally, as they will get merged automatically and cleaned up by root caller in the end
            case 'Literal': {
                const value = new BytecodeValue(object.value, this.getAvailableTempLoad());
                this.chunk.append(value.getLoadOpcode());
                objectRegister = value.register
                log(`Loaded object: ${object.value} at register ${objectRegister}`)
                break;
            }
            case 'MemberExpression': {
                objectRegister = this.resolveMemberExpression(object);
                break;
            }
            case 'BinaryExpression': {
                objectRegister = this.resolveBinaryExpression(object);
                break;
            }
            case 'CallExpression': {
                objectRegister = this.resolveCallExpression(object);
                break
            }
        }
    }

    if (!propertyRegister) {
        switch (property.type) {
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
            // same as above, no need to clean up as they will be cleaned up by root caller and automatically merged
            case 'Literal': {
                const value = new BytecodeValue(property.value, this.getAvailableTempLoad());
                this.chunk.append(value.getLoadOpcode());
                propertyRegister = value.register
                log(`Loaded property: ${property.value} at register ${propertyRegister}`)
                break;
            }
            case 'MemberExpression': {
                propertyRegister = this.resolveMemberExpression(property);
                break;
            }
            case 'BinaryExpression': {
                propertyRegister = this.resolveBinaryExpression(property);
                break;
            }
            case 'CallExpression': {
                propertyRegister = this.resolveCallExpression(property);
                break
            }
        }
    }

    const mergeTo = (objectIsImmutable) ? (propertyIsImmutable ? this.getAvailableTempLoad() : propertyRegister) : objectRegister
    this.chunk.append(new Opcode('GET_PROP', mergeTo, objectRegister, propertyRegister));
    const objectTL = this.TLMap[objectRegister]
    const propertyTL = this.TLMap[propertyRegister]
    const mergedTL = this.TLMap[mergeTo]

    if (objectTL && objectTL !== mergedTL) {
        this.freeTempLoad(objectRegister)
        log(`MemberExpression resolver: freed ${objectTL}`)
    }

    if (propertyTL && propertyTL !== mergedTL) {
        this.freeTempLoad(propertyRegister)
        log(`MemberExpression resolver: freed ${propertyTL}`)
    }

    log(`Merged MemberExpression result stored in ${mergedTL}`)

    return mergeTo
}

module.exports = resolveMemberExpression
