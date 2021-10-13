const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "removerbot", 
    description: "Remove seu bot da minha botlist!", 
    aliases: [""], 
    category: "🤖 Botlist",
    usage: "@bot", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 8,
    async execute(client, message, args, config, emojis, color, prefix){ 
        console.log("VTMNC")
    }
}