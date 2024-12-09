const jsconfuser = require("js-confuser");

async function obfuscateCode(code) {
    const obfResult = await jsconfuser.obfuscate(code, {
        target: "node",
        preset: "medium",
        stringEncoding: true,
    })
    return obfResult.code
}

module.exports = obfuscateCode
