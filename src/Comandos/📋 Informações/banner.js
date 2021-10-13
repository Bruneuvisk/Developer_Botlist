const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const axios = require('axios')

module.exports = {
    name: "banner", 
    description: "Lista o banner de algum membro!", 
    aliases: ["bn"], 
    category: "📋 Informações",
    usage: "@membro", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 

        let member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.guild.members.cache.get(args[0]) || message.author

        async function getUserBannerUrl(userId, message, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {

            if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
                return message.channel.send(`${emojis.emojierror} | Esse banner no qual está tentando ver tem um tamanho que não é suportado!`).then(xxx =>{
                    setTimeout(() => xxx.delete(), 10000) 
                })
            }
        
            if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
                return message.channel.send(`${emojis.emojierror} | O formato desse banner não é em gif ai não consigo pegar!`).then(xxx =>{
                    setTimeout(() => xxx.delete(), 10000) 
                })
            }
        
            const user = await client.api.users(userId).get();
            if (!user.banner) return null
        
            const query = `?size=${size}`;
            const baseUrl = `https://cdn.discordapp.com/banners/${userId}/${user.banner}`;
        

            if (dynamicFormat) {
                const { headers } = await axios.head(baseUrl);
                if (headers && headers.hasOwnProperty("content-type")) {
                    return baseUrl + (headers["content-type"] == "image/gif" ? ".gif" : `.${defaultFormat}`) + query;
                }
            }
        
            return baseUrl + `.${defaultFormat}` + query;
        }

        const bannerUrl = await getUserBannerUrl(member.id, message, { size: 4096 });

        const userr = await client.api.users(member.id).get();
        if (!userr.banner) {
            return message.channel.send(`${emojis.emojierror} | O usário listado não possui banner!`).then(xxx =>{
                setTimeout(() => xxx.delete(), 10000) 
            })
        }

        message.reply({embeds: [new MessageEmbed()
            .setTitle(`${emojis.emojiusers} | Banner do: ${member.username}#${member.discriminator}`)
            .setDescription(`**Clique **[aqui](${bannerUrl})** para baixar o banner.**`)
            .setColor(color)
            .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
            .setImage(bannerUrl)
        ]});

    }
}