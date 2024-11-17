# jsvm

a javascript VM for virtualizing functions

---

![Unit Tests](https://github.com/aesthetic0001/jsvm/actions/workflows/tests.yml/badge.svg)

the jsvm is a runtime which requires a compiler to convert individual **functions** to a custom binary format. this binary format can then be interpreted and executed by the jsvm. it is important to note that jsvm is **not intended for use for entire programs, but rather for individual functions**! There will be an obvious performance hit if you try to run an entire program in jsvm.

## limitations

- if you try to virtualize a program with async functions, it will not work as it introduces concurrency. jsvm currently does not support async functions in the context of the whole program. however, you can use async functions within virtualized function as they have their own context
- performance is not guaranteed. jsvm is not intended for use in high-performance applications. it is intended for use in applications where you need to protect your code from reverse engineering

## todo

- [ ] add a compiler
- [ ] add support for async functions
