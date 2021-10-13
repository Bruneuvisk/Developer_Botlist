const { MessageButton, MessageActionRow, MessageEmbed, Permissions, version } = require('discord.js')
let cpuStat = require("cpu-stat");
let os = require("os");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "botinfo", 
    description: "Exibe informações sobre mim!", 
    aliases: ["bi", "bot"], 
    category: "📋 Informações",
    usage: "", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 10,
    async execute(client, message, args, config, emojis, color, prefix){
        cpuStat.usagePercent(async function (e, percent, seconds) {
            let bruno = await client.users.fetch('469661232153231385')
            let gzn = await client.users.fetch('514466927779905539')
            let big = await client.users.fetch('800249752754585631')

            let bnturl = new MessageButton()
                .setStyle('LINK')
                .setURL('https://discord.gg/3GxgaaMkQs')
                .setLabel('Servidor Oficial!')
            let bntadd = new MessageButton() 
                .setStyle('LINK')
                .setURL('https://discord.com/oauth2/authorize?client_id=893162209650286602&scope=bot&permissions=8589934583&scope=bot%20applications.commands')
                .setLabel('Convide-me!')

            let row = new MessageActionRow()
                .addComponents(bnturl, bntadd)

            let embedbotinfo = new MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setTitle(`${emojis.developer} | Informações sobre Mim!`)
                .setDescription(`${emojis.emojicerto}・Olá <@${message.author.id}>, me chamo ${client.user.username} e sou um bot totalmente feito para rodar uma botlist em meu servidor oficial, então sou constituído com funções para votar, add bots entre outros!, lembrando que ainda estou em minha fase **BETA** então poderá ocorrer bugs em meus comandos/sistemas, abaixo informações sobre meus status no discord/vps:`)
                .addFields(
                    { name: `${emojis.emojiusers}・Minha Equipe:`, value: `**Fundadores do Projeto**: \n \`${bruno.tag}\`/\`${bruno.id}\` \n \`${gzn.tag}\`/\`${gzn.id}\` \n \`${big.tag}\`/\`${big.id}\` \n\n`, inline: false },
                    { name: `${emojis.emojipasta}・Status no Discord`, value: `Usuários Totais: \`${require("currency-formatter").format(client.users.cache.size, { code: "de-DE", symbol: "", precision: 0})}\` \n Servidores Totais: \`${require("currency-formatter").format(client.guilds.cache.size, { code: "de-DE", symbol: "", precision: 0})}\` \n Total de Comandos: \`${require("currency-formatter").format(client.commands.size, { code: "de-DE", symbol: "", precision: 0})}\` \n Total de Comandos de **/**: \`${require("currency-formatter").format(client.slashCommands.size, { code: "de-DE", symbol: "", precision: 0})}\` \n Canais Totais: \`${require("currency-formatter").format(client.channels.cache.size, { code: "de-DE", symbol: "", precision: 0})}\``, inline: false },
                    { name: `${emojis.emojibot}・Status na Vps`, value: `Uso da Memória: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\` \n Estou acordado desde de: \`${moment.duration(client.uptime).format("d [Dias], h [Horas], m [Minutos], s [Segundos]").replace("Minsutos", "Minutos")}\` \n Versão do Discord.js: \`v${version}\` \n Versão do Node.js: \`${process.version}\` \n Database em Uso: [Mongoose](https://www.mongodb.com/pt-br) \n CPU: \`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\` \n Uso da CPU: \`${percent.toFixed(2)}%\` \n Bits: \`${os.arch()}\` \n Plataforma: \`\`${os.platform()}\`\` \n Latência da API: \`${client.ws.ping}ms\``, inline: true },
                )
                .setColor(color)
                .setThumbnail(message.guild.iconURL({dynamic: true}))
                .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
                .setTimestamp()
            return message.channel.send({ embeds: [embedbotinfo], components: [row] }).then(xxx =>{
                setTimeout(() => xxx.delete(), 180000) 
            })

        })
    }
}