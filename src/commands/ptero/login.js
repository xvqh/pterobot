const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const config = require("../../../config");

class commandlogin {
    constructor() {
        this.name = "login";
        this.description = "crée toi un compte sur le ptero";
        this.options = [
            {
                type: 3,
                name: "mail",
                description: "ton email",
                required: true
            },
            {
                type: 3,
                name: "mdp",
                description: "ton mdp",
                required: true
            }
        ];
    }

    async execute(interaction, client) {
        const mail = interaction.options.getString("mail");
        const mdp = interaction.options.getString("mdp");

        const userData = {
            username: interaction.user.id,
            email: mail,
            password: mdp,
            first_name: interaction.user.id,
            last_name: interaction.user.id,
            root_admin: false,
            language: "en",
        };

        try {
            const userResponse = await axios.post(`${config.ptero.link}api/application/users`, userData, {
                headers: {
                    'Authorization': `Bearer ${config.ptero.key}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const pteroUserId = userResponse.data.attributes.id;

            const filePath = path.join(`src/db/${interaction.user.id}.json`);

            let jsonData = {};
            if (fs.existsSync(filePath)) {
                jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }

            jsonData[interaction.user.id] = {
                mail: mail,
                mdp: mdp,
                id: pteroUserId,
                apiKey: "" 
            };

            const member = interaction.user

            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4), 'utf8');

            await interaction.reply({ content: "Compte créé avec succès.", ephemeral: true });
            await member.roles.add(config.roleclient);
        } catch (error) {
            console.log(error.response?.data || error.message);   
        }
    }
}

module.exports = commandlogin;