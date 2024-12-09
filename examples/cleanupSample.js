const path = require("node:path");
const fs = require("node:fs");

const samplePath = path.join(__dirname, "../sample/");

fs.readdirSync(samplePath).forEach((file) => {
    if (file.endsWith(".virtualized.js")) {
        fs.unlinkSync(path.join(samplePath, file));
    }
})
