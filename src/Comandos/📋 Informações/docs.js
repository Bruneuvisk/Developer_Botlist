const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const axios = require("axios");

module.exports = {
    name: "docs", 
    description: "Lista alguma documentação sobre o discord.js", 
    aliases: ["djs"], 
    category: "📋 Informações",
    usage: "documento", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 
        const query = args.join(" ");
        
        if (!query) {
            return message.reply({ content: `Por favor especifique alguma documentação para eu buscar!` });
        }

        const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
          query
        )}`;
    
        axios.get(url).then(({ data }) => {
          if (data) {
            message.channel.send({ embeds: [data] });
          }
        });
    }
}