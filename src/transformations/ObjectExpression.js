const {log, LogData} = require("../utils/log");
const {Opcode, BytecodeValue} = require("../utils/assembler");

function resolveObjectExpression(node) {
    const {properties} = node

    let propertyRegisters = []

    propertyRegisters = properties.map(arg => {
        if (arg.type === 'CallExpression' && isNestedCallExpression(arg)) {
            // cleaned up in argumentRegisters.forEach
            return this.resolveCallExpression(arg);
        }
        return arg
    })

    const objectRegister = this.randomRegister()
    properties.forEach((property) => {
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
    })
}
