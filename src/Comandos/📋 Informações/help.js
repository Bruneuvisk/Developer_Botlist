const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
    name: "help", 
    description: "Mostra minha lista de comandos!", 
    aliases: ["ajuda", "comandos"], 
    category: "📋 Informações",
    usage: "", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 
        const { commands } = message.client;
        const data = [];

        if (!args[0]) {
            let menuzindecria = new MessageSelectMenu()
            .setCustomId("ajudaSelector")
            .setPlaceholder(`Selecione o qual categoria do sistema de ajuda`)
            .addOptions([
                /*{
                    label: `⚙️ | Comandos de Configurações - [${commands.filter(command => command.category == "config").size}]`,
                    description: `Da acesso aos meus comandos de configurações`,
                    emoji: "⚙️",
                    value: "1",
                },*/
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
                .setColor(color)
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
                .setTimestamp()
            let msgPrincipal = await message.channel.send({ content: `${message.author}`, embeds: [embed1], components: [row] })

            const collector = msgPrincipal.createMessageComponentCollector({
                time: 60000
            }); 

            collector.on("collect", async (interaction) => {
                interaction.deferUpdate()

                if (interaction.member.user.id !== message.author.id) {
                    return interaction.reply({
                      content: `${emojis.emojierror} | Somente o author do comando tem acesso há escolher.`,
                      ephemeral: true,
                    });
                }

                if(interaction.values.includes("2")) {
                    let editzincria = new MessageEmbed()
                        .setTitle(`${emojis.developer} | Sistema de Ajuda`)
                        .setDescription(`${emojis.emojicerto} | Abaixo tem os meus comandos na parte de **Informações**: \n ${emojis.emojicerto} | Até agora eu possuo **${client.commands.size}** comandos em minha lista \n ${emojis.emojicerto} | **Atualmente sou constituido apenas como uma botlist, só que feita totalmente por um bot então veja minhas funções**` +
                        `\n\n📋 | Comandos de Informações: \n\n \`${commands.filter(command => command.category == "📋 Informações").map(command => command.name).join('\`, \`')}\` \n\n ${emojis.emojicerto} Use o comando \`${prefix}ajuda [Comando]\` se quiser saber os detalhes do comando!` 
                        )
                        .setColor(color)
                        .setThumbnail(message.guild.iconURL({dynamic: true}))
                        .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                    msgPrincipal.edit({ embeds: [editzincria], components: [row] })
                    return
                } else if(interaction.values.includes("3")) {
                    let editzincria = new MessageEmbed()
                        .setTitle(`${emojis.developer} | Sistema de Ajuda`)
                        .setDescription(`${emojis.emojicerto} | Abaixo tem os meus comandos na parte de **Miscellaneous**: \n ${emojis.emojicerto} | Até agora eu possuo **${client.commands.size}** comandos em minha lista \n ${emojis.emojicerto} | **Atualmente sou constituido apenas como uma botlist, só que feita totalmente por um bot então veja minhas funções**` +
                        `\n\n📋 | Comandos de Miscellaneous: \n\n \`${commands.filter(command => command.category == "📋 Miscellaneous").map(command => command.name).join('\`, \`')}\` \n\n ${emojis.emojicerto} Use o comando \`${prefix}ajuda [Comando]\` se quiser saber os detalhes do comando!` 
                        )
                        .setColor(color)
                        .setThumbnail(message.guild.iconURL({dynamic: true}))
                        .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
                        .setTimestamp()
                    msgPrincipal.edit({ embeds: [editzincria], components: [row] })
                    return
                }
            })

            collector.on("end", () => {
                menuzindecria.setDisabled(true)
            });
            return
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send(`${emojis.emojierror} **|** O comando inserido não existe em minha lista!`).then(xxx =>{
                setTimeout(() => xxx.delete(), 12000) 
            })
        };

        data.push(`${emojis.emojicerto} **Nome:** \`${command.name}\``);
        if (command.aliases) data.push(`${emojis.setinhadireita} **Argumentos:** \`${command.aliases.join('\`, \`') || "Este comando não tem argumentos"}\``);
        if (command.description) data.push(`${emojis.setinhadireita} **Descrição:** ${command.description}`);
        if (command.usage) data.push(`${emojis.setinhadireita} **Como usar:** \`${prefix}${command.name} ${command.usage}\``);
        data.push(`${emojis.setinhadireita} **Cooldown:** \`${command.cooldown || 3} segundo(s)\``);

        const embedzin = new MessageEmbed()
            .setTitle(`${emojis.developer} **|** Ajuda sobre ${command.name}`)
            .setDescription(data.join("\n"))
            .setColor(color)
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
            .setTimestamp()
        return message.channel.send({ content: `${message.author}`, embeds: [embedzin] })

    },
};