const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "infobot",
    description: "Lista as informações de algum bot em na nossa botlist ou normal!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "bot", description: "Qual bot deseja exibir as informações?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
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

        if(botzin.user.bot == false) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este bot não é considerado um bot e sim um usuário!` })
        }

        const crote = await client.database.bots.findOne({
            idBot: botzin.user.id
        })

        const owner = await client.users.fetch(crote.idOwner)

        const created = `${moment(botzin.user.createdAt).format("L")} ( ${moment(botzin.user.createdAt).startOf("day").fromNow()} )` 

        if(!crote) {
            let embedinfo = new MessageEmbed()
                .setAuthor(`Informações sobre o ${botzin.user.username}#${botzin.user.discriminator}`, `${botzin.user.avatarURL()}`, `https://discord.com/oauth2/authorize?client_id=${botzin.user.id}&scope=bot&permissions=2352479809&scope=bot%20applications.commands`)
                .addFields(
                    { name: `${emojis.emojibot}・Nome`, value: `${botzin.user.username}#${botzin.user.discriminator}`, inline: true },
                    { name: `${emojis.emojitempo}・Tempo de Criação`, value: `${created}`, inline: true },
                )
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`${botzin.user.username}#${botzin.user.discriminator}`, botzin.user.avatarURL())
            return interaction.reply({ embeds: [embedinfo] })
        } else {
            let embedinfo = new MessageEmbed()
                .setAuthor(`Informações sobre o ${botzin.user.username}#${botzin.user.discriminator}`, `${botzin.user.avatarURL()}`, `https://discord.com/oauth2/authorize?client_id=${botzin.user.id}&scope=bot&permissions=2352479809&scope=bot%20applications.commands`)
                .addFields(
                    { name: `${emojis.emojibot}・Nome`, value: `${botzin.user.username}#${botzin.user.discriminator}`, inline: true },
                    { name: `${emojis.emojiusers}・Dono`, value: `${owner.tag}`, inline: true },
                    { name: `${emojis.emojibot}・Prefixo`, value: `${crote.prefixo}`, inline: true },
                    { name: `${emojis.emojipasta}・Votos`, value: `\`${require("currency-formatter").format(crote.voto, { code: "de-DE", symbol: "", precision: 0})}\``, inline: true },
                    { name: `${emojis.emojitempo}・Tempo de Criação`, value: `${created}`, inline: true },
                    { name: `${emojis.emojicerto}・Descrição`, value: `${crote.descricao}`, inline: true },
                )
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`${botzin.user.username}#${botzin.user.discriminator}`, botzin.user.avatarURL())
            return interaction.reply({ embeds: [embedinfo] })
        }

    }
}