const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "add",
    description: "Adiciona um bot em minha botlist!",
    cooldown: 15,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          //{"User": { name: "membro", description: "Qual membro deseja pegar o avatar?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
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

        await guild.members.fetch()

        const author = await client.database.usuarios.findOne({
            idUser: member.id,
        });

        let channelslogs = guild.channels.cache.get("893169793530744893")
        let correio = guild.channels.cache.get("894567512040169573")
        let cargoverificador = guild.roles.cache.get("892930771763986462")

        if(guild.id != "525178633707323393") {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este comando só pode ser usado em meu servidor oficial entre aqui: https://discord.gg/3GxgaaMkQs` })
        }

        if(channelId != "893169740342775859") {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Este comando só pode ser usado no canal de add bot em meu servidor oficial entre aqui: https://discord.gg/3GxgaaMkQs` })
        }

        let bots = author.botlist.bots

        if(bots.length >= 3) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Só pode enviar no máximo **3** bots em minha botlis por membro` })
        } 

        let bnt1 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojijs}`)
            .setCustomId('1')
            .setLabel('JavaScript');
        let bnt2 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojipython}`)
            .setCustomId('2')
            .setLabel('Python');
        let bnt3 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojijava}`)
            .setCustomId('3')
            .setLabel('Java');
        let bnt4 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojidbd}`)
            .setCustomId('4')
            .setLabel('DBD');
        let bnt5 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojitypescript}`)
            .setCustomId('5')
            .setLabel('TypeScript');
        let bnt6 = new MessageButton()
            .setStyle('PRIMARY')
            .setEmoji(`${emojis.emojigolang}`)
            .setCustomId('6')
            .setLabel('Golang');

        let row1 = new MessageActionRow()
            .addComponents(bnt1, bnt2, bnt3)
        let row2 = new MessageActionRow()
            .addComponents(bnt4, bnt5, bnt6)

        let msg1
        let msg2
        let msg3
        let msg4
        let linguagem
        let error = false
        let embed1 = new MessageEmbed()
            .setTitle(`${emojis.developer} | Adição de bot`)
            .setDescription(`${emojis.emojicerto}・Então para começar nos fale a linguegem no qual seu bot foi codado: \n\n ${emojis.emojijs}・JavaScript \n ${emojis.emojipython}・Python \n ${emojis.emojijava}・Java \n ${emojis.emojidbd}・DBD \n ${emojis.emojitypescript}・TypeScript \n ${emojis.emojigolang}・Golang \n\n ${emojis.emojicerto} Para escolher por favor selecione nos botões abaixo.`)
            .setColor(config.color)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setTimestamp()
        await interaction.reply({ ephemeral: true, embeds: [embed1], components: [row1, row2] })

        await interaction.channel
        .awaitMessageComponent({
            filter: i => i.customId === '1' && i.user.id === interaction.member.id || i.customId === '2' && i.user.id === interaction.member.id || i.customId === '3' && i.user.id === interaction.member.id || i.customId === '4' && i.user.id === interaction.member.id || i.customId === '5' && i.user.id === interaction.member.id || i.customId === '6' && i.user.id === interaction.member.id, 
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
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
            return;
        });
        if (error) return;

        if(msg1 == "1") {
            linguagem = `${emojis.emojijs} JavaScript`
        } else if(msg1 == "2") {
            linguagem = `${emojis.emojipython} Python`
        } else if(msg1 == "3") {
            linguagem = `${emojis.emojijava} Java`
        } else if(msg1 == "4") {
            linguagem = `${emojis.emojidbd} DBD`
        } else if(msg1 == "5") {
            linguagem = `${emojis.emojitypescript} TypeScript`
        } else if(msg1 == "6") {
            linguagem = `${emojis.emojigolang} Golang`
        }

        let embedid = new MessageEmbed()
            .setTitle(`${emojis.developer} | Adição de bot`)
            .setDescription(`${emojis.emojicerto}・Agora nos envie o **id** do seu bot que deseja enviar:`)
            .setColor(config.color)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setTimestamp()
        interaction.editReply({ ephemeral: true, embeds: [embedid], components: [] })
        
        await interaction.channel
        .awaitMessages({
            filter: (m) => m.author.id === interaction.member.id,
            max: 1,
            time: 60000,
            errors: ["time"],
        })
        .then((collected) => {
            msg2 = collected.first().content.trim().split(/ +/g);
            collected.first().delete();
        })
        .catch((err) => {
            error = true;
            let embedtempo = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojitempo} | ${interaction.member},  __O tempo para escolher foi encerrado!__`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
            return
        })
        if (error) return;

        let botzinho = await client.users.fetch(msg2[0])

        if(!botzinho || botzinho.bot == false || botzinho.id == client.user.id) {
            let embedtempo = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojierror} | ${interaction.member},  __O id do bot enviado não é válido!__`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
            return
        }

        if(bots.some((x) => x == botzinho.id)) {
            let embedtempo = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojierror} | ${interaction.member},  __Você já enviou este bot e não poderá enviar de novo!__`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
            return
        }

        let embedprefix = new MessageEmbed()
            .setTitle(`${emojis.developer} | Adição de bot`)
            .setDescription(`${emojis.emojicerto}・Agora nos envie o **prefixo** do seu bot que deseja enviar:`)
            .setColor(config.color)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setTimestamp()
        interaction.editReply({ ephemeral: true, embeds: [embedprefix], components: [] })

        await interaction.channel
        .awaitMessages({
            filter: (m) => m.author.id === interaction.member.id,
            max: 1,
            time: 60000,
            errors: ["time"],
        })
        .then((collected) => {
            msg3 = collected.first().content.trim().split(/ +/g);
            collected.first().delete();
        })
        .catch((err) => {
            error = true;
            let embedtempo = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojitempo} | ${interaction.member},  __O tempo para escolher foi encerrado!__`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
            return
        })
        if (error) return;

        if(msg3[0].length >= 5) {
            let embederrin = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojierror} | ${interaction.member},  __O prefixo enviado é muito grande!__`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embederrin], components: [] })
            return
        }

        let embeddesc = new MessageEmbed()
            .setTitle(`${emojis.developer} | Adição de bot`)
            .setDescription(`${emojis.emojicerto}・Agora nos envie uma **descrição** do seu bot que deseja enviar (máximo 300 caracteres):`)
            .setColor(config.color)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setTimestamp()
        interaction.editReply({ ephemeral: true, embeds: [embeddesc], components: [] })

        await interaction.channel
        .awaitMessages({
            filter: (m) => m.author.id === interaction.member.id,
            max: 1,
            time: 60000,
            errors: ["time"],
        })
        .then((collected) => {
            msg4 = collected.first().content;
            collected.first().delete();
        })
        .catch((err) => {
            error = true;
            let embedtempo = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojitempo} | ${interaction.member},  __O tempo para escolher foi encerrado!__`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embedtempo], components: [] })
            return
        })
        if (error) return;

        if(msg4.length >= 300) {
            let embederrin = new MessageEmbed()
                .setTitle(`${emojis.emojierror} | Error!`) 
                .setDescription(`${emojis.emojierror} | ${interaction.member},  __A descrição enviada é muito grande!__`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embederrin], components: [] })
            return
        }
        

        let embedcarregando = new MessageEmbed()
            .setDescription(`${emojis.emojicerto} | Carregando...`)    
            .setColor(config.color)
        interaction.editReply({ ephemeral: true, embeds: [embedcarregando], components: [] })

        setTimeout(async () => {
            let embedcarregando = new MessageEmbed()
                .setDescription(`${emojis.emojicerto} | Carregando.....`)    
                .setColor(config.color)
            interaction.editReply({ ephemeral: true, embeds: [embedcarregando], components: [] })
        }, 5000)

        setTimeout(async () => {
            let embedcarregando = new MessageEmbed()
                .setDescription(`${emojis.emojicerto} | Carregando.......`)    
                .setColor(config.color)
            interaction.editReply({ ephemeral: true, embeds: [embedcarregando], components: [] })
        }, 10000)

        setTimeout(async () => {
            await client.database.usuarios.findOneAndUpdate(
                { idUser: member.id },
                { $push: { "botlist.bots": botzinho.id } }
            );

            await client.database.bots.create({
                idBot: botzinho.id,
                idOwner: member.id,
                verificado: false,
                linguagem: linguagem,
                prefixo: msg3[0],
                voto: 0,
                descricao: msg4
            });

            const created = `${moment(botzinho.createdAt).format("L")} ( ${moment(botzinho.createdAt).startOf("day").fromNow()} )` 

            let embedcerto = new MessageEmbed()
                .setTitle(`${emojis.developer} | Adição de bot`)
                .setDescription(`${emojis.emojicerto} | ${interaction.member}, Seu bot **${botzinho.username}#${botzinho.discriminator}** foi enviado com sucesso para a verificação espere pra ser aprovado!`)    
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            interaction.editReply({ ephemeral: true, embeds: [embedcerto], components: [] })

            let embedlogs = new MessageEmbed()
                .setTitle(`${emojis.emojicerto} | O ${interaction.member.user.username}#${interaction.member.user.discriminator} Enviou o ${botzinho.username}#${botzinho.discriminator} para a verificação!`)
                .setDescription(`${emojis.setinhadireita}・**Pode demorar um pouco para seu bot ser aprovado agora basta aguardar**`)
                .setColor(config.color)
                .setThumbnail(botzinho.avatarURL())
                .setFooter(`${botzinho.username}#${botzinho.discriminator}`, botzinho.avatarURL())
            channelslogs.send({ content: `${interaction.member}`, embeds: [embedlogs] })

            let correiobot = new MessageEmbed()
                .setTitle(`${emojis.developer} | Um bot está esperando pra ser verificado!`)
                .setDescription(`${emojis.emojicerto}・Abaixo as informações do bot enviado: \n ${emojis.setinhadireita}・**Linguagem do Bot:** ${linguagem} \n ${emojis.setinhadireita}・**ID:** ${botzinho.id} \n ${emojis.setinhadireita}・**Prefixo:** ${msg3[0]} \n ${emojis.setinhadireita}・**Descrição:** ${msg4} \n\n ${emojis.emojicerto}・**Informações Extras:** \n ${emojis.setinhadireita}・**Data de criação:** ${created} \n ${emojis.setinhadireita}・**Link:** [Clique aqui para adicionar](https://discord.com/api/oauth2/authorize?client_id=${botzinho.id}&permissions=2151009856&scope=bot%20applications.commands)`)
                .setColor(config.color)
                .setThumbnail(botzinho.avatarURL())
                .setFooter(`${botzinho.username}#${botzinho.discriminator}`, botzinho.avatarURL())
            correio.send({ content: `<@&${cargoverificador.id}>`, embeds: [correiobot] })

        }, 15000)

 
    }
}