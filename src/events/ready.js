const Discord = require("discord.js")
const { ActivityType } = require("discord.js")
module.exports = {
    name: "ready",
    once: true,

    async execute(client) {
        console.log(`${client.user.tag} est bien en ligne`)

        client.user.setActivity("🏯", { type: ActivityType.Competing})
        client.user.setStatus("dnd")
    }
}