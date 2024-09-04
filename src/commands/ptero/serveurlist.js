const Discord = require("discord.js");
const axios = require("axios");
const config = require("../../../config");
const fs = require("fs");
const path = require("path");

class commandserveurlist {
    constructor() {
        this.name = "serveurlist";
        this.description = "Affiche Tout vos serveurs";
    }

    async execute(interaction, client) {
        const filePath = path.join(`src/db/${interaction.user.id}.json`);
        if (!interaction.member.roles.cache.has(config.roleclient)) {
            return interaction.reply({ content: "Vous n'êtes pas client.", ephemeral: true });
        }

        if (!fs.existsSync(filePath)) {
            return interaction.reply({ content: "Tu dois d'abord te connecter avec la commande /login", ephemeral: true });
        }

        const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const userId = userData[interaction.user.id].id;

        let servers;
        try {
            const response = await axios.get(`${config.ptero.link}api/application/users/${userId}`, {
                method: 'GET',
                params: {
                    include: 'servers'
                },
                headers: {
                    'Authorization': `Bearer ${config.ptero.key}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            servers = response.data.attributes.relationships.servers.data;
        } catch (error) {
            console.log(error);
        }

        if (!servers || servers.length === 0) {
            return interaction.reply({ content: "Vous n'avez aucun serveur.", ephemeral: true });
        }

        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTitle("🪄 ▸ Liste de vos serveurs")
            .setDescription(`Vous avez **${servers.length}** serveurs.`)
            .setColor("White");

        const selectOptions = servers.map(server => ({
            label: server.attributes.name,
            description: `Id: ${server.attributes.identifier}`,
            value: server.attributes.identifier
        }));

        const selectMenu = new Discord.StringSelectMenuBuilder()
            .setCustomId("server-select")
            .setPlaceholder("Sélectionnez un serveur")
            .addOptions(selectOptions);

        const row = new Discord.ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

        const filter = i => i.customId === "server-select" && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on("collect", async i => {
            const selectedServer = servers.find(server => server.attributes.identifier === i.values[0]);
        
            if (selectedServer) {
                const name = selectedServer.attributes.name || "Aucun";
                const eggId = selectedServer.attributes.egg;
                const id = selectedServer.attributes.identifier || "Aucun";
        
                const langage = Object.keys(config.ptero.eggs).find(key => config.ptero.eggs[key] === eggId) || "Aucun";
        
                console.log({ name, langage, identifier });
        
                const serverEmbed = new Discord.EmbedBuilder()
                    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                    .setTitle(`🖥️ ▸ Informations du serveur : ${name}`)
                    .addFields(
                        { name: "Nom", value: name, inline: true },
                        { name: "Langage", value: langage, inline: true },
                        { name: "Id", value: id, inline: true }
                    )
                    .setColor("White");
        
                await i.update({ embeds: [serverEmbed], components: [row] });
            }
        });
    }
}

module.exports = commandserveurlist;