const {log} = require("../utils/log");
const {Opcode, BytecodeValue, encodeDWORD} = require("../utils/assembler");
const {registers, needsCleanup} = require("../utils/constants");

// returns the register with the result of the expression, this should not require early DFS because
// arguments are resolved and cleaned up immediately after they are used
function resolveCallExpression(node) {
    const {callee, arguments} = node;
    let calleeRegister

    log(`Resolving call expression: ${callee.type}(${arguments.map(arg => arg.type).join(', ')})`)

    switch (callee.type) {
        case 'Identifier': {
            calleeRegister = this.getVariable(callee.name);
            log(`Loaded callee: ${callee.name} at register ${calleeRegister}`)
            break;
        }
        case 'Literal': {
            const value = new BytecodeValue(callee.value, this.getAvailableTempLoad());
            this.chunk.append(value.getLoadOpcode());
            calleeRegister = value.register
            log(`Loaded callee: ${callee.value} at register ${calleeRegister}`)
            break;
        }
        case 'MemberExpression': {
            calleeRegister = this.resolveMemberExpression(callee);
            break;
        }
        case 'BinaryExpression': {
            calleeRegister = this.resolveBinaryExpression(callee);
            break;
        }
        case 'CallExpression': {
            calleeRegister = this.resolveCallExpression(callee);
            break;
        }
    }

    const argsRegister = this.getAvailableTempLoad()
    const counterRegister = this.getAvailableTempLoad()
    const oneRegister = this.getAvailableTempLoad()

    this.chunk.append(new Opcode('SETUP_ARRAY', argsRegister, encodeDWORD(arguments.length)));
    this.chunk.append(new Opcode('LOAD_DWORD', counterRegister, encodeDWORD(0)));
    this.chunk.append(new Opcode('LOAD_DWORD', oneRegister, encodeDWORD(1)));

    log(`Allocated array for arguments at ${this.TLMap[argsRegister]} (${argsRegister}) with size ${arguments.length}`)

    arguments.forEach((arg, index) => {
        let valueRegister
        switch (arg.type) {
            case 'Identifier': {
                valueRegister = this.getVariable(arg.name);
                break
            }
            case 'Literal': {
                const tempRegister = this.getAvailableTempLoad();
                const value = new BytecodeValue(arg.value, tempRegister);
                this.chunk.append(value.getLoadOpcode());
                valueRegister = value.register
                break
            }
            case 'MemberExpression': {
                valueRegister = this.resolveMemberExpression(arg);
                break
            }
            case 'BinaryExpression': {
                valueRegister = this.resolveBinaryExpression(arg);
                break
            }
            case 'CallExpression': {
                valueRegister = this.resolveCallExpression(arg);
                break
            }
        }
        log(`Loaded argument ${index} (${arguments[index].type}) at register ${valueRegister}`)
        this.chunk.append(new Opcode('SET_INDEX', argsRegister, counterRegister, valueRegister));
        if (needsCleanup(arg)) this.freeTempLoad(valueRegister)
        this.chunk.append(new Opcode('ADD', counterRegister, counterRegister, oneRegister));
    })

    const mergeTo = argsRegister
    this.chunk.append(new Opcode('FUNC_ARRAY_CALL', calleeRegister, mergeTo, registers.VOID, argsRegister));
    if (needsCleanup(callee)) this.freeTempLoad(calleeRegister)
    this.freeTempLoad(counterRegister)
    this.freeTempLoad(oneRegister)

    log(`CallExpression return value is at ${this.TLMap[mergeTo]} (${mergeTo})`)

    return mergeTo
}

module.exports = resolveCallExpression
