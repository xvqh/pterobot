const Discord = require("discord.js")

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        if(interaction.isCommand()) {

            const { commandName } = interaction

            const command = client.commands.get(commandName)


            if(!command) return;

            command.execute(interaction, client)
        } if (!interaction.isSelectMenu()) return;

        if (interaction.customId === 'help_select') {
            const selectedCommand = client.commands.get(interaction.values[0]);
    
            const commandEmbed = new Discord.EmbedBuilder()
                .setTitle(`🪄 ▸ Commande: ${selectedCommand.name}`)
                .setDescription(`Name: **${selectedCommand.name}**\nDescription: **${selectedCommand.description || 'Aucune description'}**`)
                .setColor("White");
    
            await interaction.update({ embeds: [commandEmbed] });
        }
    }
}