const { Client, Collection, Intents } = require("discord.js")
const fs = require("fs");
const config = require("./src/Json/config.json")
const { sep } = require("path")
const { start } = require("./src/Database/mongoose")
const c = require("colors")
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING
    ]
})

client.commands = new Collection()
client.slashCommands = new Collection()
client.database = new Collection()

require("./src/Struturas/SlashHandler")(client)

const loadEvents = (dir = "./src/Eventos/") => {
    fs.readdir(dir, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            const event = require(`${dir}${file}`); 
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
            console.log(c.yellow(`[EVENTOS] - O Evento ${eventName} foi carregado com sucesso;`));
        });
    })
}
  
const loadCommands = (dir = "./src/Comandos/") => {
    fs.readdirSync(dir).forEach(dirs => {
        const commandFiles = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js")); 
        for (const file of commandFiles) {
            const command = require(`${dir}/${dirs}/${file}`); 
            client.commands.set(command.name, command); 
            console.log(c.cyan(`[COMANDOS] - O comando ${command.name} foi carregado com sucesso;`));
        } 
    });
};

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

start()
loadCommands()
loadEvents()

client.login(config.token)
