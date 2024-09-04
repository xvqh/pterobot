const Discord = require("discord.js")
const client = new Discord.Client({
    intents: [Object.keys(Discord.GatewayIntentBits)]
})
const fs = require("fs")

client.color = require("./config").color
client.commands = new Discord.Collection()
client.events = new Discord.Collection()

const foldercmd = fs.readdirSync("./src/commands")
const eventfile = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"))

for (const folder of foldercmd) {
    commandfile = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"))

   console.log("Commandes:")

for (const file of commandfile) {
    const command = require(`./src/commands/${folder}/${file}`) 

    const data = new command()
    client.commands.set(data.name, data)

    console.log(`${data.name} chargé`)
}}

const commands = Array.from(client.commands.values())


console.log("Events: ")

for (const file of eventfile) {
    const event = require(`./src/events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
    console.log(`${event.name} chargé`)
}

client.on("ready", () => {
    client.application.commands.set(commands.map(({ execute, ...data}) => data))
})

client.login(require(`./config`).token)
