const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "vote",
    description: "Vota em algum bot em minha botlist!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "bot", description: "Qual bot deseja conceder o voto?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
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

        let UserOption = options.getUser("bot");

        await guild.members.fetch()

        const botzin = guild.members.cache.get(UserOption.id);
        const users = await client.database.usuarios.findOne(
            { idUser: interaction.member.id }
        )
        let timecooldown = 43200000
        let timezin = users.botlist.cooldown
        let guildzinha = client.guilds.cache.get("525178633707323393")
        let channel_votes = guildzinha.channels.cache.get("897639430838435860")

        if (timezin !== null && timecooldown - (Date.now() - timezin) > 0) {
            let time = moment.duration(timecooldown - (Date.now() - timezin)).format("h [horas], m [minutos] e s [segundos]").replace("minsutos", "minutos")

            let embedtimezinho = new MessageEmbed()
                .setTitle(`${emojis.emojitempo} | Error de Tempo`)
                .setDescription(`${emojis.emojierror} | Você votou recentemente aguarde para votar de novo em **${time}**!`)
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            return interaction.reply({ ephemeral: true, embeds: [embedtimezinho] })
        }

        if(botzin.user.bot == false) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este bot não é considerado um bot e sim um usuário!` })
        }

        const crote = await client.database.bots.findOne({
            idBot: botzin.user.id
        })

        if(!crote) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este bot não está em minha botlist por favor adicione seu bot em addbot!` })
        }

        await client.database.bots.findOneAndUpdate(
            { idBot: botzin.user.id },
            { $set: { voto: crote.voto + 1 } } 
        )

        await client.database.usuarios.findOneAndUpdate(
            { idUser: interaction.member.id },
            { $set: { "botlist.cooldown": Date.now() } }
        )

        let embedreps = new MessageEmbed()
            .setDescription(`${emojis.emojicerto} | Parabéns ${interaction.member}, você acabou de votar no **${botzin.user.username}#${botzin.user.discriminator}**!`)
            .setColor(config.color)
        interaction.reply({ embeds: [embedreps] })

        let embedlogs = new MessageEmbed()
            .setTitle(`${emojis.emojibot} | O Bot ${botzin.user.username}#${botzin.user.discriminator} recebeu um voto`)
            .setDescription(`**${emojis.emojicerto}・O ${interaction.member} votou no bot com sucesso, o bot agora possui um total de \`${crote.voto + 1}\` votos**`)
            .setColor(config.color)
            .setThumbnail(botzin.user.avatarURL())
            .setFooter(`${botzin.user.username}#${botzin.user.discriminator}`, botzin.user.avatarURL())
        channel_votes.send({ content: `<@${crote.idOwner}>`, embeds: [embedlogs] })       
        
    }
}