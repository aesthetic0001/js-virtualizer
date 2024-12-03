# virtualize.js

virtualization-based obfuscation for javascript

---

![Unit Tests](https://github.com/aesthetic0001/virtualize.js/actions/workflows/tests.yml/badge.svg)

virtualize.js is a proof-of-concept project which brings virtualization-based obfuscation to javascript. In this implementation, bytecode is fed to a virtual machine implemented javascript which runs on its own instruction set. A transpiler is included to convert individual **functions** to opcodes for the VM. It is important to note that virtualize.js is **not intended for use on entire programs, but rather for individual functions**! There will be a significant performance hit if you try to run an entire program through the VM.

## Limitations

- if you try to virtualize a program with async functions, it will not work as it introduces concurrency. the JSVM currently does not support async functions in the context of the whole program. however, you can use async functions within virtualized function as they have their own context
- performance is not guaranteed. virtualize.js is not intended for use in high-performance applications. it is intended for use in applications where you need to protect your code from reverse engineering
- no other obfuscation techniques are applied to the input code. virtualize.js is not intended to be used as a standalone obfuscation tool, but rather to be used in conjunction with other obfuscation techniques
- given the virtual machine, the virtualized function is pretty trivial to reverse engineer. it is recommended that the virtual machine class is obfuscated before use

## Todo

- [x] transpiler
- [x] provide a proper `this` property to functions
- [ ] template literals
- [x] proper for and while loops
- [ ] sequence expressions
- [ ] arrow functions
- [ ] object expressions
- [ ] callbacks
- [ ] add support for async functions in the context of the whole program
- [ ] allow for declaration of classes (i don't know why you would want to init a class in a function but this is still a limitation of the current implementation)
- [ ] obfuscation passes/optimization passes
