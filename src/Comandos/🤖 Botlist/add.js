const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "add", 
    description: "Adiciona um bot em minha botlist!", 
    aliases: [""], 
    category: "🤖 Botlist",
    usage: "", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 15,
    async execute(client, message, args, config, emojis, color, prefix){ 
        console.log("VTMNC")
    }
}