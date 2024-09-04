const Discord = require("discord.js")
const path = require("path")
const fs = require("fs")
const config = require("../../../config")

class commandapikey {
    constructor(client) {
        this.name = "apikey",
        this.description = "config ton api key",
        this.options = [
            {
                type: 3,
                name: "api",
                description: "votre api key",
                required: true
            }
        ]
    }
    async execute(interaction, client) {
        const apiKey = interaction.options.getString("api");
        if (!interaction.member.roles.cache.has(config.roleclient)) {
            return interaction.reply({ content: "Vous n'êtes pas client.", ephemeral: true });
        }
        const filePath = path.join(`src/db/${interaction.user.id}.json`);

        try {
            let jsonData = {};
            if (fs.existsSync(filePath)) {
                jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }

            if (!jsonData[interaction.user.id]) {
                await interaction.reply({ content: "Tu dois d'abord te connecter avec la commande /login", ephemeral: true });
                return;
            }

            jsonData[interaction.user.id].apiKey = apiKey;

            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4), 'utf8');

            await interaction.reply({ content: "api enregistré avec succès", ephemeral: true });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = commandapikey