const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "verificar",
    description: "Os analisadores poderam avaliar o seu bot em nossa botlist!",
    cooldown: 15,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "bot", description: "Qual bot deseja verificar?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
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
        let guildzinha = client.guilds.cache.get("525178633707323393")
        let memberserver = guildzinha.members.cache.get(interaction.member.id)
        let channelslogs = guild.channels.cache.get("893169793530744893")
        let cargodev = guild.roles.cache.get("892914605070905344")
        let cargobotverificado = guild.roles.cache.get("894579604122132521")
        let cargobotnotverified = guild.roles.cache.get("894579721935937636")

        if(guild.id != "525178633707323393") {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este comando só pode ser usado em meu servidor oficial entre aqui: https://discord.gg/3GxgaaMkQs` })
        }

        if(botzin.user.bot == false) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este bot não é considerado um bot e sim um usuário!` })
        }
    
        const crote = await client.database.bots.findOne({
            idBot: botzin.user.id
        })

        if(!crote) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este bot não está em minha lista pra ser verificado!` })
        }

        if(crote.verificado == true) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | O bot citado já está verificado em nossa botlist!` })
        }

        if(!memberserver.roles.cache.get("892930771763986462")) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Você precisa ser staff oficial em meu servidor de suporte parta verificar um bot!`})
        }

        const created = `${moment(botzin.user.createdAt).format("L")} ( ${moment(botzin.user.createdAt).startOf("day").fromNow()} )`
        const ownerbot = guildzinha.members.cache.get(crote.idOwner)

        if(!ownerbot) {
            await client.database.usuarios.findOneAndUpdate(
                { idUser: crote.idOwner },
                { $pull: { "botlist.bots": crote.idBot } }
            );

            guildzinha.members.cache.get(crote.idBot).kick("O dono edeste bot saiu do servidor")

            await crote.deleteOne()

            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | O dono do bot não está no servidor portanto o bot foi removido da botlist!` })
        }

        let bnt1 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojicerto}`)
            .setCustomId('1')
            .setLabel('Aceitar');
        let bnt2 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojierror}`)
            .setCustomId('2')
            .setLabel('Recusar');
        
        let row = new MessageActionRow()
            .addComponents(bnt1, bnt2)


        let error = false
        let msg1
        let msg2
        let embedregistro = new MessageEmbed()
            .setTitle(`${emojis.developer} | Verificação de Bots`)
            .setDescription(`${emojis.emojicerto}・Opções referentes a verificação: \n\n ${emojis.emojicerto} **Aprovar** \n ${emojis.emojierror} **Reprovar** \n **__Opções Adicionais__** \n\n **Data de Criação:** **${created}** \n **Dono do Bot:** **${ownerbot.user.username}#${ownerbot.user.discriminator}**`)
            .setColor(config.color)
            .setThumbnail(botzin.user.avatarURL())
            .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
        interaction.reply({ ephemeral: true, embeds: [embedregistro], components: [row] })


        await interaction.channel
        .awaitMessageComponent({
            filter: i => i.customId === '1' && i.user.id === interaction.member.id || i.customId === '2' && i.user.id === interaction.member.id, 
            max: 1,
            time: 60000,
            errors: ["time"],
        })
        .then((i) => {
            msg1 = i.customId
            i.deferUpdate()
        })
        .catch((err) => {
            error = true;
            let embedtempo = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojitempo} | ${interaction.member},  __O tempo para escolher foi encerrado!__`)    
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
            interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
            return;
        });
        if (error) return;

        if(msg1 == '1') {
            let embeedmotivo = new MessageEmbed()
                .setTitle(`${emojis.developer} | Verificação de Bots`)
                .setDescription(`${emojis.emojicerto}・Agora escreva neste chat o motivo para estar **__aprovando__** o bot do membro:`)
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
            interaction.editReply({ ephemeral: true, embeds: [embeedmotivo], components: [] })

            await interaction.channel
            .awaitMessages({
                filter: (m) => m.author.id === interaction.member.id,
                max: 1,
                time: 180000,
                errors: ["time"],
            })
            .then((collected) => {
                msg2 = collected.first().content;
                collected.first().delete();
            })
            .catch((err) => {
                error = true;
                let embedtempo = new MessageEmbed()
                    .setTitle(`${emojis.emojierror} | Error!`) 
                    .setDescription(`${emojis.emojitempo} | ${interaction.member},  __O tempo para escolher foi encerrado!__`)    
                    .setColor(config.color)
                    .setThumbnail(botzin.user.avatarURL())
                    .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
                interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
                return
            })
            if (error) return;

            if(msg2.length > 1000) {
                let embederror = new MessageEmbed()
                    .setTitle(`${emojis.emojierror} | Error!`) 
                    .setDescription(`${emojis.emojierror} | ${interaction.member},  __A mensagem enviada é muito grande e não pode ser aceita!__`)    
                    .setColor(config.color)
                    .setThumbnail(botzin.user.avatarURL())
                    .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
                interaction.editReply({ ephemeral: true, embeds: [embederror], components: [] })
                return
            }

            await client.database.bots.findOneAndUpdate(
                { idBot: botzin.user.id },
                { $set: { verificado: true } }
            )

            ownerbot.roles.add(cargodev.id)
            botzin.setNickname(`${botzin.user.username} - ${crote.prefixo}`)
            botzin.roles.add(cargobotverificado.id)
            botzin.roles.remove(cargobotnotverified.id)

            let embededmotivo = new MessageEmbed()
                .setTitle(`${emojis.emojicerto} | Aprovado`)
                .setDescription(`${emojis.emojicerto}・Informações importantes: \n **Dono:** Cargo <@&${cargodev.id}> foi adicionado \n **Bot:** Apelido foi trocado e cargo <@&${cargobotverificado.id}> foi adicionado e o cargo <@&${cargobotnotverified.id}> foi removido!`)
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
            interaction.editReply({ ephemeral: true, embeds: [embededmotivo], components: [] })


            let embedlogs = new MessageEmbed()
                .setTitle(`${emojis.emojicerto} | ${ownerbot.user.username}#${ownerbot.user.discriminator} o seu bot ${botzin.user.username}#${botzin.user.discriminator} foi aprovado no nosso servidor!`)
                .setDescription(`${emojis.setinhadireita}・**Motivo:** ${msg2}`)
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
            channelslogs.send({ content: `<@${ownerbot.user.id}>`, embeds: [embedlogs] })
            ownerbot.send({ embeds: [embedlogs] })
            return
        } else {
            let embeedmotivo = new MessageEmbed()
                .setTitle(`${emojis.developer} | Verificação de Bots`)
                .setDescription(`${emojis.emojicerto}・Agora escreva neste chat o motivo para estar **__reprovando__** o bot do membro:`)
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
            interaction.editReply({ ephemeral: true, embeds: [embeedmotivo], components: [] })

            await interaction.channel
            .awaitMessages({
                filter: (m) => m.author.id === interaction.member.id,
                max: 1,
                time: 180000,
                errors: ["time"],
            })
            .then((collected) => {
                msg2 = collected.first().content;
                collected.first().delete();
            })
            .catch((err) => {
                error = true;
                let embedtempo = new MessageEmbed()
                    .setTitle(`${emojis.emojierror} | Error!`) 
                    .setDescription(`${emojis.emojitempo} | ${interaction.member},  __O tempo para escolher foi encerrado!__`)    
                    .setColor(config.color)
                    .setThumbnail(botzin.user.avatarURL())
                    .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
                interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
                return
            })
            if (error) return;

            if(msg2.length > 1000) {
                let embederror = new MessageEmbed()
                    .setTitle(`${emojis.emojierror} | Error!`) 
                    .setDescription(`${emojis.emojierror} | ${interaction.member},  __A mensagem enviada é muito grande e não pode ser aceita!__`)    
                    .setColor(config.color)
                    .setThumbnail(botzin.user.avatarURL())
                    .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
                interaction.editReply({ ephemeral: true, embeds: [embederror], components: [] })
                return
            }

            await client.database.usuarios.findOneAndUpdate(
                { idUser: crote.idOwner },
                { $pull: { "botlist.bots": crote.idBot } }
            );

            guildzinha.members.cache.get(crote.idBot).kick("Foi reprovado na nossa botlist")

            await crote.deleteOne()

            let embededmotivo = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Reprovado`)
                .setDescription(`${emojis.setinhadireita}・Informações importantes: \n **Bot:** bot foi removido da fila e expulso do servidor!`)
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
            interaction.editReply({ ephemeral: true, embeds: [embededmotivo], components: [] })


            let embedlogs = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | ${ownerbot.user.username}#${ownerbot.user.discriminator} o seu bot ${botzin.user.username}#${botzin.user.discriminator} foi reprovado no nosso servidor!`)
                .setDescription(`${emojis.setinhadireita}・**Motivo:** ${msg2}`)
                .setColor(config.color)
                .setThumbnail(botzin.user.avatarURL())
                .setFooter(`Verificador: ${interaction.member.user.tag}`, interaction.member.user.avatarURL())
            channelslogs.send({ content: `<@${ownerbot.user.id}>`, embeds: [embedlogs] })
            ownerbot.send({ embeds: [embedlogs] })
        }


    }
}