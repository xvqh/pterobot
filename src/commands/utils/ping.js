const Discord = require("discord.js");

class commandping {
    constructor() {
        this.name = "ping",
        this.description = "Affiche le ping du bot"
    }

    async execute(interaction, client) {
        interaction.reply(`ping: \`${client.ws.ping}\``)
    }
}

module.exports = commandping;