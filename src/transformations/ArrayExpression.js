const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {needsCleanup} = require("../utils/constants");

function resolveArrayExpression(node) {
    const {elements} = node

    const arrayRegister = this.getAvailableTempLoad()
    const counterRegister = this.getAvailableTempLoad()
    const oneRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('SETUP_ARRAY', arrayRegister, encodeDWORD(elements.length)));
    this.chunk.append(new Opcode('LOAD_DWORD', counterRegister, encodeDWORD(0)));
    this.chunk.append(new Opcode('LOAD_DWORD', oneRegister, encodeDWORD(1)));

    elements.forEach((element) => {
        let elementRegister
        switch (element.type) {
            case 'Identifier': {
                elementRegister = this.getVariable(element.name);
                break
            }
            case 'Literal': {
                const tempRegister = this.getAvailableTempLoad();
                const literalValue = new BytecodeValue(element.value, tempRegister);
                this.chunk.append(literalValue.getLoadOpcode());
                elementRegister = literalValue.register
                break
            }
            case 'MemberExpression': {
                elementRegister = this.resolveMemberExpression(element);
                break;
            }
            case 'BinaryExpression': {
                elementRegister = this.resolveBinaryExpression(element);
                break;
            }
            case 'CallExpression': {
                elementRegister = this.resolveCallExpression(element);
                break
            }
            case 'ObjectExpression': {
                elementRegister = this.resolveObjectExpression(element);
                break
            }
            case 'ArrayExpression': {
                elementRegister = this.resolveArrayExpression(element);
                break
            }
        }

        this.chunk.append(new Opcode('SET_INDEX', arrayRegister, counterRegister, elementRegister));
        if (needsCleanup(element)) this.freeTempLoad(elementRegister)
        this.chunk.append(new Opcode('ADD', counterRegister, counterRegister, oneRegister))
    })
    this.freeTempLoad(counterRegister)
    this.freeTempLoad(oneRegister)
    return arrayRegister
}

module.exports = resolveArrayExpression
