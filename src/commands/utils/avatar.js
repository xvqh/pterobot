const Discord = require("discord.js")

class commandavatar {
    constructor() {
        this.name = "avatar"
        this.description = "Affiche l'avatar de l'utilisateur mentionné ou le vôtre si aucun utilisateur n'est mentionné."
        this.options = [
            {
                type: 6,
                name: "user",
                description: "L'utilisateur dont vous souhaitez afficher l'avatar",
                required: false
            }
        ]
    }
    async execute(interaction, client) {
        const user = interaction.options.getUser("user") || interaction.user
        const avatarURL = user.displayAvatarURL({ size: 4096, dynamic: true });

        const embed = new Discord.EmbedBuilder()
        .setAuthor({name: `${user.tag}`, iconURL: user.displayAvatarURL()})
        .setImage(avatarURL)
        .setTimestamp()
        .setFooter({text: interaction.user.username, iconURL: "https://cdn.discordapp.com/avatars/1209478626517590046/a_0d5d142fe26da5e3952af6b42631d9cd.webp"})

        interaction.reply({embeds: [embed]})
    }
}
module.exports = commandavatar