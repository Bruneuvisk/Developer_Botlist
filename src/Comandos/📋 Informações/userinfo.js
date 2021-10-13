const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    name: "userinfo", 
    description: "Mostra as informações sobre um usuário!", 
    aliases: [""], 
    category: "📋 Informações",
    usage: "@membro", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){
        console.log("VTMNC")
    }
}