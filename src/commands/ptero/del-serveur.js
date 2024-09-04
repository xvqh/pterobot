const Discord = require("discord.js")
const axios = require("axios")
const config = require("../../../config")
class commanddelserveur {
    constructor() {
        this.name = "del-serveur"
        this.description = "delete un serveur",
            this.options = [
                {
                    type: 10,
                    name: "id",
                    description: "id du serveur",
                    required: true
                }
            ]
    }
    async execute(interaction, client) {
        const id = interaction.options.getNumber("id")
        if (!interaction.user.id === config.owners) {
            return;
        }

        const options = {
            method: 'DELETE',
            url: `${config.ptero.link}api/application/servers/${id}`,
            headers: {
                'Authorization': `Bearer ${config.ptero.key}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        const reponse = await axios(options)

        if (reponse.status === 204) {
            await interaction.reply({ content: `Le serveur a été supprimé avec succès.`, ephemeral: true });
        } else {
            await interaction.reply({ content: `id invalide.`, ephemeral: true });
        }
    }
}
module.exports = commanddelserveur