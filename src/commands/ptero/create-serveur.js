const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const config = require("../../../config");
const request = require("request")

class commandcreateserver {
    constructor() {
        this.name = "create-serveur";
        this.description = 'crée toi un serveur';
        this.options = [
            {
                type: 3,
                name: "nom",
                description: "nom du serveur",
                required: true
            },{
                type: 3,
                name: "type",
                description: "Type de serveur (nodejs ou python)",
                required: true,
                choices: [
                    { name: "Node.js", value: "nodejs" },
                    { name: "Python", value: "python" }
                ]
            }
        ];
    }

    async getAllocations() {
        try {
            const response = await axios.get(`${config.ptero.link}api/application/nodes/1/allocations`, {
                headers: {
                    'Authorization': `Bearer ${config.ptero.key}`,
                    'Accept': 'application/json'
                }
            });
            return response.data.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async execute(interaction, client) {
        const serverName = interaction.options.getString("nom");
        const serverType = interaction.options.getString("type");

        if (!interaction.member.roles.cache.has(config.roleclient)) {
            return interaction.reply({ content: "Vous n'êtes pas client.", ephemeral: true });
        }

        const filePath = path.join(`src/db/${interaction.user.id}.json`);

        if (!fs.existsSync(filePath)) {
            return interaction.reply({ content: "Tu dois d'abord te connecter avec la commande /login", ephemeral: true });
        }

        const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const userInfo = userData[interaction.user.id];
        console.log(userInfo.id);

        const allocations = await this.getAllocations();

        if (!allocations || allocations.length === 0) {
            return interaction.reply({ content: "Aucune allocation disponible pour créer un serveur contacter un admin.", ephemeral: true });
        }

        const availableAllocation = allocations.find(a => !a.attributes.assigned);

        const allocationId = availableAllocation.attributes.id;

        const eggId = config.ptero.eggs[serverType];

        let startupScript;
        if (serverType === "nodejs") {
            startupScript = config.ptero.startup.nodejs;
        } else if (serverType === "python") {
            startupScript = config.ptero.startup.python;
        }

        let dockerlang; 
        if (serverType === "nodejs") {
            dockerlang = config.ptero.docker_image.nodejs
        } else if (serverType === "python") {
            dockerlang = config.ptero.docker_image.python
        }
        
        let environnement;
        if (serverType === "nodejs") {
            environnement = config.ptero.environnement.MAIN_FILE
        } else if (serverType === "python") {
            environnement = config.ptero.environnement.PY_FILE
        }

        let requirement;
        if (serverType === "python") {
            requirement = config.ptero.environnement.REQUIREMENTS_FILE
        }
        const options = {
            method: 'POST',
            url: `${config.ptero.link}api/application/servers`,
            headers: {
                'Authorization': `Bearer ${config.ptero.key}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: serverName,
                user: userInfo.id,
                egg: eggId,
                docker_image: dockerlang,
                startup: startupScript,
                environment: {
                    BUNGEE_VERSION: "latest",
                    SERVER_JARFILE: "server.jar",
                    STARTUP_CMD: "app.py",
                    BUILD_NUMBER: "1",
                    USER_UPLOAD: 0,
                    AUTO_UPDATE: 0,
                    PY_FILE: environnement,
                    MAIN_FILE: environnement,
                    REQUIREMENTS_FILE: requirement
                },
                limits: {
                    memory: 0,
                    swap: 0,
                    disk: 0,
                    io: 500,
                    cpu: 0
                },
                feature_limits: {
                    databases: 0,
                    backups: 0
                },
                allocation: {
                    default: allocationId
                }
            })
        };

        request(options, async (error, response, body) => {
            if (error) {
                console.log(error);
                return;
            }

            if (response.statusCode !== 201) {
                console.log(body);
                return;
            }

            const data = JSON.parse(body);
            await interaction.reply({ content: `Serveur créé avec succès : ${data.attributes.name}`, ephemeral: true });
        });
    }
}

module.exports = commandcreateserver