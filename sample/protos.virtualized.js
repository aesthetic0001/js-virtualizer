const JSVM = require('../src/vm');
function evaluate() {
    const VM = new JSVM();
    VM.loadFromString('eJylkLFKA0EQhuc2K5xZJQQ8TGGhkHDIdhb2cmJ/gl2m0iCCGFAU1k6w8x3CtNPZ3XMs+AxXL/cCp7s5D2OhiTbDz87M/387AgEAEotiLgz2AOBMEABEqbUU1NqQLY2Y+wwA3QRtJv1z53p6uc2a4jAtlHcQhdcDUjZVqlBMmnYw26zr+nWGIKxugqp5YnePKhwR9b3FMA49waF6u0jNMMLDqlfX9Zsne2zIjGnJTEu2FZ4OUjaUIC/BaFrG0F5MHlNECVLW4L+METpGjxt+Fw713OA41+K4bzgXKbtlcIT0+/u5kx/Hy38CKxfBnkqEjtOlxE9/0hguGX1dkz5l/XRyfn97d/UwGSAXKbNShBp/WY2LoGWo+fw4RVSsYhHSN9r03aOTfwKUfwGQx9OblX4+QLbt7DuWsbkJ', 'base64');
    VM.loadDependencies({ 43: console });
    VM.run();
    return VM.registers[163];
}
evaluate();