// WIP: This script is used to create a standalone file that contains the VM and the constants with shuffled names
const acorn = require("acorn");
const path = require("node:path");
const escodegen = require("escodegen");
const fs = require("fs");

const vmPath = path.join(__dirname, '../vm.js');
const constantsPath = path.join(__dirname, '../utils/constants.js');
const opcodePath = path.join(__dirname, '../utils/opcodes.js');

const vmFile = fs.readFileSync(vmPath, 'utf-8');
const constantsFile = fs.readFileSync(constantsPath, 'utf-8');
const opcodeFile = fs.readFileSync(opcodePath, 'utf-8');

// extract the constants, merge them into the vm file, and write the result to a new file
const vmAST = acorn.parse(vmFile, {ecmaVersion: "latest", sourceType: "module"});
const constantsAST = acorn.parse(constantsFile, {ecmaVersion: "latest", sourceType: "module"});
const opcodeAST = acorn.parse(opcodeFile, {ecmaVersion: "latest", sourceType: "module"});

// vmAST.body.shift()
// opcodeAST.body.shift()
// opcodeAST.body.shift()

const savedConstants = []
for (const constant of constantsAST.body) {
    savedConstants.push(constant);
}

// savedConstants.pop(); // remove the module.exports line

vmAST.body = constantsAST.body.concat(vmAST.body);

const mergedCode = escodegen.generate(vmAST);
fs.writeFileSync(path.join(__dirname, '../vm_dist.js'), mergedCode);
