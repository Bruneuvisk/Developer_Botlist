const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "fila", 
    description: "Vê a fila de bots que estão esperando para serem verificados!", 
    aliases: [""], 
    category: "🤖 Botlist",
    usage: "", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 8,
    async execute(client, message, args, config, emojis, color, prefix){ 
        console.log("VTMNC")
    }
}