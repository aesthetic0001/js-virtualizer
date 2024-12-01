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
        // must be computed, so we can't treat it as a literal
        const {outputRegister, borrowed} = this.resolveExpression(object);
        objectRegister = outputRegister
        objectIsImmutable = borrowed
    }

    if (!propertyRegister) {
        const {outputRegister, borrowed} = this.resolveExpression(property, {computed, thisRegister: objectRegister});
        propertyRegister = outputRegister
        propertyIsImmutable = borrowed
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
