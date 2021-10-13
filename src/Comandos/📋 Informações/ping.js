const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    name: "ping", 
    description: "Demonstra a Latência e a API sobre mim!", 
    aliases: [""], 
    category: "📋 Informações",
    usage: "", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 
        try {
         const m = await message.channel.send({ content: "Carregando..." }); 
         const embed = new MessageEmbed()
            .setColor(color)
            .addField("⌛ Latência", `**${m.createdTimestamp -  message.createdTimestamp}ms**`)
            .addField("💓 API", `**${Math.floor(client.ws.ping)}ms**`) 
            .setFooter("Ping!!", message.guild.iconURL({dynamic: true}))
          m.edit({content: `🏓 Pong!`, embeds: [embed] })
        } catch (error) {
          return message.channel.send(`Alguma coisa correu mal: ${error.message}`); 
        }
    },
};