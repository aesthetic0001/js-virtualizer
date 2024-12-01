const mineflayer = require('mineflayer')

function onLogin() {
    console.log("Logged in")
}

// @virtualize
function main() {
    const username = Math.random().toString(36).substring(7)
    const bot = mineflayer.createBot({
        host: "blocksmc.com",
        port: 25565,
        username
    });

    console.log("Logging in as " + username)

    bot.once('login', onLogin)
}

main()
