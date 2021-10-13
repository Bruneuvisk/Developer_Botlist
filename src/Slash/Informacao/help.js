const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")

module.exports = {
    name: "help",
    description: "Mostra minha lista de comandos!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          {"String": { name: "nome_comando", description: "Se quiser escolha um comando para exibir informações sobre o mesmo?", required: false }}, //to use in the code: interacton.getString("ping_amount")
          //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
          //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
          //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
          //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
          //{"StringChoices": { name: "nome_comando", description: "Se quiser escolha um comando para exibir informações sobre o mesmo.", required: false, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {
        const { commands } = client;
        const data = [];

        const { member, channelId, guildId, applicationId, 
            commandName, deferred, replied, ephemeral, 
            options, id, createdTimestamp 
        } = interaction; 

        const server = await client.database.servidores.findOne({
            idServer: interaction.guild.id,
        });

        const args = options.getString("nome_comando")

        let prefix; 
        if(!server) {
            prefix = config.prefix;
        } else {
            prefix = server.prefix
        }

        if (!args) {
            let menuzindecria = new MessageSelectMenu()
            .setCustomId("ajudaSelector")
            .setPlaceholder(`Selecione o qual categoria do sistema de ajuda`)
            .addOptions([
                {
                    label: `🤖 | Comandos de Botlist - [${commands.filter(command => command.category == "🤖 Botlist").size}]`,
                    description: `Da acesso aos meus comandos de botlist`,
                    emoji: "🤖",
                    value: "1",
                },
                {
                    label: `📋 | Comandos de Informação - [${commands.filter(command => command.category == "📋 Informações").size}]`,
                    description: `Da acesso aos comandos de informação`,
                    emoji: "📋",
                    value: "2",
                },
                {
                    label: `🔰 | Comandos de Miscellaneous - [${commands.filter(command => command.category == "🔰 Miscellaneous").size}]`,
                    description: `Da acesso aos comandos de miscellaneous`,
                    emoji: "🔰",
                    value: "3",
                },
                /*{
                    label: `💥 | Comandos de Diversão - [${commands.filter(command => command.category == "diversão").size}]`,
                    description: `Da acesso aos comandos de diversão`,
                    emoji: "💥",
                    value: "4",
                },*/
                /*{
                    label: `⚒️ | Comandos de Moderação - [${commands.filter(command => command.category == "moderação").size}]`,
                    description: `Da acesso aos comandos de moderação`,
                    emoji: "⚒️",
                    value: "5",
                },*/
                /*{
                    label: `🎵 | Comandos de Música - [${commands.filter(command => command.category == "música").size}]`,
                    description: `Da acesso aos comandos de música`,
                    emoji: "🎵",
                    value: "6",
                },*/
                /*{
                    label: `🚀 | Comandos de Filtros - [${commands.filter(command => command.category == "filtros").size}]`,
                    description: `Da acesso aos comandos de filtros para músicas`,
                    emoji: "🚀",
                    value: "7",
                }*/
            ])
        
            let row = new MessageActionRow()
                .addComponents(menuzindecria)


            const embed1 = new MessageEmbed()
                .setTitle(`${emojis.developer} | Sistema de Ajuda`)
                .setDescription(`${emojis.emojicerto}・Para ter acesso aos meus comandos selecione no menu abaixo, se tiver alguma dúvida entre no meu servidor de suporte [Click Aqui](https://discord.gg/3GxgaaMkQs) \n ${emojis.emojicerto} | **Atualmente sou constituido apenas como uma botlist, só que feita totalmente por um bot então veja minhas funções**`)
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            await interaction.reply({  content: `${interaction.member}`, embeds: [embed1], components: [row] })

            const collector = interaction.channel.createMessageComponentCollector({
                time: 60000
            }); 

            collector.on("collect", async (b) => {
                b.deferUpdate()

                if (b.member.user.id !== interaction.member.id) {
                    return b.reply({
                      content: `${emojis.emojierror} | Somente o author do comando tem acesso há escolher.`,
                      ephemeral: true,
                    });
                }

                if(b.values.includes("1")) {
                    let editzincria = new MessageEmbed()
                        .setTitle(`${emojis.developer} | Sistema de Ajuda`)
                        .setDescription(`${emojis.emojicerto} | Abaixo tem os meus comandos na parte de **Botlist**: \n ${emojis.emojicerto} | Até agora eu possuo **${client.commands.size}** comandos em minha lista \n ${emojis.emojicerto} | **Atualmente sou constituido apenas como uma botlist, só que feita totalmente por um bot então veja minhas funções**` +
                        `\n\n🤖 | Comandos de Botlist: \n\n \`${commands.filter(command => command.category == "🤖 Botlist").map(command => command.name).join('\`, \`')}\` \n\n ${emojis.emojicerto} Use o comando \`/info help [Comando]\` se quiser saber os detalhes do comando!` 
                        )
                        .setColor(config.color)
                        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                        .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                    interaction.editReply({ embeds: [editzincria], components: [row] })
                    return
                } else if(b.values.includes("2")) {
                    let editzincria = new MessageEmbed()
                        .setTitle(`${emojis.developer} | Sistema de Ajuda`)
                        .setDescription(`${emojis.emojicerto} | Abaixo tem os meus comandos na parte de **Informações**: \n ${emojis.emojicerto} | Até agora eu possuo **${client.commands.size}** comandos em minha lista \n ${emojis.emojicerto} | **Atualmente sou constituido apenas como uma botlist, só que feita totalmente por um bot então veja minhas funções**` +
                        `\n\n📋 | Comandos de Informações: \n\n \`${commands.filter(command => command.category == "📋 Informações").map(command => command.name).join('\`, \`')}\` \n\n ${emojis.emojicerto} Use o comando \`/info help [Comando]\` se quiser saber os detalhes do comando!` 
                        )
                        .setColor(config.color)
                        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                        .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                    interaction.editReply({ embeds: [editzincria], components: [row] })
                    return
                } else if(b.values.includes("3")) {
                    let editzincria = new MessageEmbed()
                        .setTitle(`${emojis.developer} | Sistema de Ajuda`)
                        .setDescription(`${emojis.emojicerto} | Abaixo tem os meus comandos na parte de **Miscellaneous**: \n ${emojis.emojicerto} | Até agora eu possuo **${client.commands.size}** comandos em minha lista \n ${emojis.emojicerto} | **Atualmente sou constituido apenas como uma botlist, só que feita totalmente por um bot então veja minhas funções**` +
                        `\n\n📋 | Comandos de Miscellaneous: \n\n \`${commands.filter(command => command.category == "🔰 Miscellaneous").map(command => command.name).join('\`, \`')}\` \n\n ${emojis.emojicerto} Use o comando \`/info help [Comando]\` se quiser saber os detalhes do comando!` 
                        )
                        .setColor(config.color)
                        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                        .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                    interaction.editReply({ embeds: [editzincria], components: [row] })
                    return
                }
            })

            collector.on("end", () => {
                menuzindecria.setDisabled(true)
            });
            return
        }

        const name = args.toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return interaction.reply({ content: `${emojis.emojierror} **|** O comando inserido não existe em minha lista!`, ephemeral: true })
        };

        let use = ``

        if(command.name == name && command.category == "📋 Informações") {
            use = `/info`
        } else if(command.name == name && command.category == "🔰 Miscellaneous") {
            use = `/misce`
        } else if(command.name == name && command.category == "🤖 Botlist") {
            use = `/bot`
        }

        data.push(`${emojis.emojicerto} **Nome:** \`${command.name}\``);
        if (command.description) data.push(`${emojis.setinhadireita} **Descrição:** ${command.description}`);
        if (command.usage) data.push(`${emojis.setinhadireita} **Como usar:** \`${use} ${command.name} ${command.usage}\``);
        data.push(`${emojis.setinhadireita} **Cooldown:** \`${command.cooldown || 3} segundo(s)\``);

        const embedzin = new MessageEmbed()
            .setTitle(`${emojis.developer} **|** Ajuda sobre ${command.name}`)
            .setDescription(data.join("\n"))
            .setColor(config.color)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setTimestamp()
        return interaction.reply({ content: `${interaction.member}`, embeds: [embedzin] })
    }
}