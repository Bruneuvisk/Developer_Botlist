const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "infobot", 
    description: "Lista as informações de algum bot em na nossa botlist ou normal!", 
    aliases: [""], 
    category: "📋 Informações",
    usage: "@bot", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 
        console.log("LETS'GO")
    }
}