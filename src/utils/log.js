const fs = require("fs");
const os = require('os')
const path = require("node:path");

const d = new Date()
const logFolder = path.join(os.homedir(), "jsvm_logs")
const logName = `${d.getDate()}-${(d.getMonth() + 1)}-${d.getFullYear()}-at-${d.getHours()}_${d.getMinutes()}_${d.getMilliseconds()}.txt`
if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder)
const writeStream = fs.createWriteStream(path.join(logFolder, logName))

const verbose = process.argv.includes("--verbose")

const colors = {
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    magenta: "\x1b[35m"
}

const map = {
    warn: colors.yellow,
    error: colors.red,
    success: colors.green,
    info: colors.cyan,
    accent: colors.magenta
}

function LogData(text, type = 'info', verboseOnly = true) {
    this.text = text
    this.type = type
    this.verboseOnly = verboseOnly
}

function log(data) {
    if (typeof data === "string") data = new LogData(data)
    const currentDate = new Date()
    const {text, type, verboseOnly} = data
    if (verboseOnly && !verbose) return
    let base = ''
    base += `<${currentDate.getHours().toString().length === 1 ? `0${currentDate.getHours().toString()}` : currentDate.getHours().toString()}:${currentDate.getMinutes().toString().length === 1 ? `0${currentDate.getMinutes().toString()}` : currentDate.getMinutes().toString()}> `
    base += "\x1b[34mJSVM > \x1b[0m"
    base += map[type]
    base += text + "\x1b[0m"
    writeStream.write(text.replace(/\[\d+m/g, "") + "\n")
    console.log(base)
}

module.exports = {
    log,
    LogData
}
