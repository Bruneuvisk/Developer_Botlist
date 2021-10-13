const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "removerbot",
    description: "Remove seu bot da minha botlist!",
    cooldown: 8,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "bot", description: "Qual bot deseja remover da sua lista?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
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

        if(!crote) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este bot não está registrado em minha botlist!` })
        }

        const owner = await client.users.fetch(crote.idOwner)
        const botremove = await client.users.fetch(botzin.user.id)

        let guild_dev = client.guilds.cache.get("525178633707323393")
        let botserver = guild_dev.members.cache.get(botremove.id)
        let channelslogs = guild.channels.cache.get("893169793530744893")

        if(owner.id != interaction.member.id) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Você não é dono deste bot!` })
        }

        let embedlogs = new MessageEmbed()
            .setTitle(`${emojis.emojierror} | Aviso: Seu bot ${botzin.user.username}#${botzin.user.discriminator} foi removido do servidor oficial pois você mesmo quis retira-ló então o expulsei e apaguei as informações do mesmo!`)
            .setColor(config.color)
            .setThumbnail(botzin.user.avatarURL())
            .setFooter(`${interaction.member.user.tag}`, interaction.member.user.avatarURL())
        channelslogs.send({ content: `${interaction.member}`, embeds: [embedlogs] })

        await crote.deleteOne()

        await client.database.usuarios.findOneAndUpdate(
            { idUser: interaction.member.id },
            { $pull: { "botlist.bots": botremove.id } }
        )

        botserver.kick("O dono do bot decidiu remover o bot da botlist")

        return interaction.reply({ content: `${emojis.emojicerto} | O seu bot **${botremove.username}#${botremove.discriminator}** foi removido do meu servidor oficial, e removido da minha botlist com sucesso!` })

    }
}