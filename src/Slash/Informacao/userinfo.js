const { MessageEmbed, MessageButton, MessageActionRow, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "userinfo",
    description: "Mostra as informações sobre um usuário!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "membro", description: "Qual membro deseja ver as informações?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
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

        const userzinho = await client.database.usuarios.findOne(
            { idUser: interaction.member.id },
        )

        const joined = `${moment(membro.user.joinedTimestamp).format("L")} ( ${moment(membro.user.joinedTimestamp).startOf("day").fromNow()} )`
        const created = `${moment(membro.user.createdAt).format("L")} ( ${moment(membro.user.createdAt).startOf("day").fromNow()} )`  

        if(!userzinho) {
            let embeduser = new MessageEmbed()  
                .setTitle(`${emojis.emojiusers} ${membro.user.username}#${membro.user.discriminator}`)
                .setDescription(`${emojis.emojibot} **Total de Bots:** **0/3** \n ${emojis.setinhadireita} **Reputações:** **0** \n ${emojis.setinhadireita} **Data de Criação da Conta:** **${created}** \n ${emojis.setinhadireita} **Data que entrou servidor**: **${joined}** \n ${emojis.setinhadireita} **Bots:** \n **Não Possui**`)
                .setColor(config.color)
                .setThumbnail(membro.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            return interaction.reply({ embeds: [embeduser], components: [row] })
        }

        let limit = userzinho.botlist.bots
        let argszinho = []
        let row

        if(limit.length == 1) {
            const unzinho = await client.users.fetch(limit[0])

            let bnt1 = new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/oauth2/authorize?client_id=${limit[0]}&scope=bot&permissions=2151009856&scope=bot%20applications.commands`)
                .setLabel(`${unzinho.username}#${unzinho.discriminator}`)
            row = new MessageActionRow().addComponents(bnt1)

        } else if(limit.length == 2) {
            const unzinho = await client.users.fetch(limit[0])
            const doiszinho = await client.users.fetch(limit[1])

            let bnt1 = new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/oauth2/authorize?client_id=${limit[0]}&scope=bot&permissions=2151009856&scope=bot%20applications.commands`)
                .setLabel(`${unzinho.username}#${unzinho.discriminator}`)
            let bnt2 = new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/oauth2/authorize?client_id=${limit[1]}&scope=bot&permissions=2151009856&scope=bot%20applications.commands`)
                .setLabel(`${doiszinho.username}#${doiszinho.discriminator}`)

            row = new MessageActionRow().addComponents(bnt1, bnt2)

        } else if(limit.length == 3) {
            const unzinho = await client.users.fetch(limit[0])
            const doiszinho = await client.users.fetch(limit[1])
            const trezinha = await client.users.fetch(limit[2])

            let bnt1 = new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/oauth2/authorize?client_id=${limit[0]}&scope=bot&permissions=2151009856&scope=bot%20applications.commands`)
                .setLabel(`${unzinho.username}#${unzinho.discriminator}`)
            let bnt2 = new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/oauth2/authorize?client_id=${limit[1]}&scope=bot&permissions=2151009856&scope=bot%20applications.commands`)
                .setLabel(`${doiszinho.username}#${doiszinho.discriminator}`)
            let bnt3 = new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/oauth2/authorize?client_id=${limit[2]}&scope=bot&permissions=2151009856&scope=bot%20applications.commands`)
                .setLabel(`${trezinha.username}#${trezinha.discriminator}`)

            row = new MessageActionRow().addComponents(bnt1, bnt2, bnt3)
            
        } else {
            row = null
        }

        for(const bnts of limit) {
            const tagzinha = await client.users.fetch(bnts)

            if(!tagzinha) return row = null

            argszinho.push(
                {
                    tag: `${tagzinha.username}#${tagzinha.discriminator}`,
                    id: tagzinha.id
                }
            )
        }

        if(row == null) {
            let embeduser = new MessageEmbed()  
                .setTitle(`${emojis.emojiusers} ${membro.user.username}#${membro.user.discriminator}`)
                .setDescription(`${emojis.emojibot} **Total de Bots:** **${limit.length == 0 ? "0" : limit.length}/3** \n ${emojis.setinhadireita} **Reputações:** **${userzinho.reps.quantidade == 0 ? "0": userzinho.reps.quantidade}** \n ${emojis.setinhadireita} **Data de Criação da Conta:** **${created}** \n ${emojis.setinhadireita} **Data que entrou servidor**: **${joined}** \n ${emojis.setinhadireita} **Bots:** \n **Não Possui**`)
                .setColor(config.color)
                .setThumbnail(membro.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            return interaction.reply({ embeds: [embeduser] })
        } else {
            let embeduser = new MessageEmbed()  
                .setTitle(`${emojis.emojiusers} ${membro.user.username}#${membro.user.discriminator}`)
                .setDescription(`${emojis.emojibot} **Total de Bots:** **${limit.length == 0 ? "0" : limit.length}/3** \n ${emojis.setinhadireita} **Reputações:** **${userzinho.reps.quantidade == 0 ? "0": userzinho.reps.quantidade}** \n ${emojis.setinhadireita} **Data de Criação da Conta:** **${created}** \n ${emojis.setinhadireita} **Data que entrou servidor**: **${joined}** \n ${emojis.setinhadireita} **Bots:** \n ${argszinho.map((x) => `**[${x.tag}](https://discord.com/oauth2/authorize?client_id=${x.id}&scope=bot&permissions=2151009856&scope=bot%20applications.commands)**`).join("\n")}`)
                .setColor(config.color)
                .setThumbnail(membro.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            return interaction.reply({ embeds: [embeduser], components: [row] })
        }
    }
}