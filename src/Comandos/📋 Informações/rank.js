const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "rank", 
    description: "Exibe os ranks que possuo em meus sistemas!", 
    aliases: [""], 
    category: "📋 Informações",
    usage: "Reps ou Votos", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 10,
    async execute(client, message, args, config, emojis, color, prefix){
        console.log("LETS'GO")
    }
}