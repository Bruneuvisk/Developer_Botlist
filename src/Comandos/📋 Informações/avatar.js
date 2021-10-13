const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    name: "avatar", 
    description: "Lista o avatar de algum membro!", 
    aliases: ["av"], 
    category: "📋 Informações",
    usage: "@membro", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 

        let member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.guild.members.cache.get(args[0]) || message.author

        const avatar = member.displayAvatarURL({
            dynamic: true,
            size: 2048,
        });

        message.reply({embeds: [new MessageEmbed()
            .setTitle(`${emojis.emojiusers} | Avatar do: ${member.username}#${member.discriminator}`)
            .setDescription(`**Clique **[aqui](${avatar})** para baixar o avatar.**`)
            .setColor(color)
            .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
            .setImage(avatar)
        ]});

    }
}
