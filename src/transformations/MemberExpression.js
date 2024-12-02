const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue} = require("../utils/assembler");

function isNestedMemberExpression(node) {
    return node.object.type === 'MemberExpression' || node.property.type === 'MemberExpression'
}

// returns the register with the result of the expression
// forceObjectImmutability: used for function calls, so that we are able to store the function this value
function resolveMemberExpression(node, forceObjectImmutability) {
    const {object, property, computed} = node;
    let objectRegister, propertyRegister
    let objectIsImmutable = forceObjectImmutability ?? false, propertyIsImmutable = false

    log(`Resolving MemberExpression: ${object.type}.${property.type} -- Options: computed: ${computed} | forceObjectImmutability: ${forceObjectImmutability}`)

    if (object.type === 'MemberExpression' && isNestedMemberExpression(object)) {
        objectRegister = this.resolveMemberExpression(object).outputRegister
        log(`Object result is at ${this.TLMap[objectRegister]}`)
    }

    if (property.type === 'MemberExpression' && isNestedMemberExpression(property)) {
        propertyRegister = this.resolveMemberExpression(property).outputRegister
        log(`Property result is at ${this.TLMap[propertyRegister]}`)
    }

    if (!objectRegister) {
        // must be computed, so we can't treat it as a literal
        const {outputRegister, borrowed} = this.resolveExpression(object);
        objectRegister = outputRegister
        objectIsImmutable = borrowed || forceObjectImmutability
        log(`Resolved non-nested object at register ${objectRegister}`)
    }

    if (!propertyRegister) {
        const {outputRegister, borrowed} = this.resolveExpression(property, {computed});
        propertyRegister = outputRegister
        propertyIsImmutable = borrowed
        log(`Resolved non-nested property at register ${propertyRegister}`)
    }

    log(`Immutability: object: ${objectIsImmutable}, property: ${propertyIsImmutable}`)

    const mergeTo = (objectIsImmutable) ? (propertyIsImmutable ? this.getAvailableTempLoad() : propertyRegister) : objectRegister
    this.chunk.append(new Opcode('GET_PROP', mergeTo, objectRegister, propertyRegister));

    const objectTL = this.TLMap[objectRegister]
    const propertyTL = this.TLMap[propertyRegister]
    const mergedTL = this.TLMap[mergeTo]

    // if objectIsImmutable: we need caller to free
    if (objectTL && objectTL !== mergedTL && !objectIsImmutable) {
        this.freeTempLoad(objectRegister)
        log(`MemberExpression resolver: freed object at ${objectTL}`)
    }

    if (propertyTL && propertyTL !== mergedTL) {
        this.freeTempLoad(propertyRegister)
        log(`MemberExpression resolver: freed property at ${propertyTL}`)
    }

    log(`Merged MemberExpression result stored in ${mergedTL}`)

    return {
        outputRegister: mergeTo,
        objectRegister
    }
}

module.exports = resolveMemberExpression
