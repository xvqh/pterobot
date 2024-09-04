const Discord = require("discord.js")

class commandhelp {
    constructor() {
        this.name = "help"
        this.description = "Affiche la liste des commandes"
    }
    async execute(interaction, client) {
        const selectMenu = new Discord.StringSelectMenuBuilder()
            .setCustomId('help_select')
            .setPlaceholder('Sélectionnez une commande...')
            .addOptions(
                client.commands.map(cmd => ({
                    label: cmd.name,
                    value: cmd.name,
                    description: cmd.description || ""
                }))
            );

        const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setTitle("🪄 ▸ Liste des commandes")
            .setDescription(`Il y a **${client.commands.size}** commandes.`)
            .setColor("White");

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
}

module.exports = commandhelp;