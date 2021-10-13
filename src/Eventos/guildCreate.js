const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../Json/config.json")
const emojis = require("../Json/emojis.json")
const filterregions = {
    "en-US": "🇺🇸 | Estados Unidos",
    "en-GB": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 | Inglaterra", 
    "zh-CN": "🇨🇳 | China",
    "zh-TW": "🇨🇳 | China",
    "cs": "🇨🇿 | Chéquia",
    "da": "🇩🇰 | Dinamarca",
    "nl": "🇳🇱 | Paises Baixos",
    "fr": "🇫🇷 | França",
    "de": "🇩🇪 | Alemanha",
    "el": "🇬🇷 | Grécia",
    "hu": "🇭🇺 | Hungria",
    "it": "🇮🇹 | Itália",
    "ja": "🇯🇵 | Japão",
    "ko": "🇰🇷 | Corea do Sul",
    "no": "🇳🇴 | Noruega", 
    "pl": "🇵🇱 | Polonia",
    "pt-BR": "🇧🇷 | Brasil",
    "ru": "🇷🇺 | Russia",
    "es-ES": "🇪🇸 | Espanha",
    "sv-SE": "🇸🇪 | Suécia",
    "tr": "🇹🇷 | Turquia",
    "bg": "🇧🇬 | Bulgária",
    "uk": "🇺🇦 | Ucrânia",
    "fi": "🇫🇮 | Finlândia",
    "hr": "🇭🇷 | Croácia",
    "ro": "🇷🇴 | Roménia",
    "lt": "🇱🇹 | Lituânia"
}

module.exports = async (client, guild) => {

    const server = await client.database.servidores.findOne({
        idServer: guild.id,
    });

      if(!server) {
        await client.database.servidores.create({ 
            idServer: guild.id
        });

        let owner = await client.users.fetch(guild.ownerId)

        let embedentrou = new MessageEmbed()
            .setTitle(`${emojis.developer} **Servidor adicionado!** ${emojis.developer}`)
            .setDescription(`**\`📜\` Dados do servidor** \n\n \`🔌\` __Nome Do Servidor__: ${guild.name} \n \`👑\` __Dono do Servidor__: <@${guild.ownerId}>/${owner.tag}/\`${owner.id}\` \n \`🌐\` __Região do Servidor__: ${filterregions[guild.preferredLocale]} \n \`👥\` __Membros do Servidor__: ${guild.memberCount} \n \`🆔\` __ID do Servidor__: ${guild.id} \n \`🕋\` __Total de Canais__: ${guild.channels.cache.size}`)
            .setThumbnail(guild.iconURL({dynamic: true}))
            .setColor(config.color)
        let canalEnviar = client.guilds.cache.get('525178633707323393').channels.cache.get('895515761525817415')
        canalEnviar.send({ embeds: [embedentrou] })
      } else {
        let owner = await client.users.fetch(guild.ownerId)

        let embedentrou = new MessageEmbed()
            .setTitle(`${emojis.developer} **Servidor adicionado!** ${emojis.developer}`)
            .setDescription(`**\`📜\` Dados do servidor** \n\n \`🔌\` __Nome Do Servidor__: ${guild.name} \n \`👑\` __Dono do Servidor__: <@${guild.ownerId}>/${owner.tag}/\`${owner.id}\` \n \`🌐\` __Região do Servidor__: ${filterregions[guild.preferredLocale]} \n \`👥\` __Membros do Servidor__: ${guild.memberCount} \n \`🆔\` __ID do Servidor__: ${guild.id} \n \`🕋\` __Total de Canais__: ${guild.channels.cache.size}`)
            .setThumbnail(guild.iconURL({dynamic: true}))
            .setColor(config.color)
        let canalEnviar = client.guilds.cache.get('525178633707323393').channels.cache.get('895515761525817415')
        canalEnviar.send({ embeds: [embedentrou] })
      }

}