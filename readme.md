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
- [x] template literals
- [x] proper for and while loops
- [ ] sequence expressions
- [x] object and array destructuring
- [x] arrow functions
- [x] object expressions
- [x] callbacks
- [ ] proper reference counting to manage variables captured by protos (functions declared within functions) and other data types which are passed by reference (objects, arrays, etc.)
  - currently, any captured variables do not get dropped by the transpiler and persist in memory, even when going out of scope
  - need to add a way to check for references to both variables which store protos as well as the variables which are captured by protos
  - once no more references to the proto exist, all variables captured by the proto should be dropped (assuming they have no other references; there should be a counter for the number of references to captured variables)
- [ ] add support for async functions in the context of the whole function
  - currently, you are only able to properly await functions, but not run them concurrently as you would in a normal program
  - ~~async would require complex register management. the registers need to be restored after calling the async function, but some registers may have been mutated by the program before the resolution.~~ this can be mitigated as we can just never drop any variables and keep them for the entire lifetime of the function. however, this would still require async context switching
- [ ] allow for declaration of classes (i don't know why you would want to init a class in a function but this is still a limitation of the current implementation)
- [ ] obfuscation passes/optimization passes
