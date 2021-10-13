const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const axios = require('axios')

module.exports = {
    name: "banner",
    description: "Lista o banner de algum membro!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "membro", description: "Qual membro deseja pegar o banner?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
          //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
          //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
          //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
          //{"StringChoices": { name: "qual_ping", description: "Qual ping você quer saber sobre mim?", required: true, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {

        const { member, channelId, guildId, applicationId, 
            commandName, deferred, replied, ephemeral, 
            options, id, createdTimestamp 
        } = interaction; 
        const { guild } = member;

        let UserOption = options.getUser("membro");
        if(!UserOption) UserOption = member.user;

        await guild.members.fetch()
        const membro = guild.members.cache.get(UserOption.id);

        async function getUserBannerUrl(userId, interaction, { dynamicFormat = true, defaultFormat = "webp", size = 512 } = {}) {

            if (![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(size)) {
                return interaction.reply({ content: `${emojis.emojierror} | Esse banner no qual está tentando ver tem um tamanho que não é suportado!`, ephemeral: true })
            }
        
            if (!["webp", "png", "jpg", "jpeg"].includes(defaultFormat)) {
                return interaction.reply({ content: `${emojis.emojierror} | O formato desse banner não é em gif ai não consigo pegar!`, ephemeral: true })
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

        const bannerUrl = await getUserBannerUrl(membro.id, interaction, { size: 4096 });

        const userr = await client.api.users(membro.id).get();
        if (!userr.banner) {
            return interaction.reply({ content: `${emojis.emojierror} | O usário listado não possui banner!`, ephemeral: true })
        }

        let embedbn = new MessageEmbed()
            .setTitle(`${emojis.emojiusers} | Banner do: ${membro.user.username}#${membro.user.discriminator}`)
            .setDescription(`**Clique **[aqui](${bannerUrl})** para baixar o banner.**`)
            .setColor(config.color)
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setImage(bannerUrl)
        await interaction.reply({ embeds: [embedbn] })
    }
}