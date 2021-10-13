const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "reps", 
    description: "Mostra as suas reputações!", 
    aliases: [""], 
    category: "📋 Informações",
    usage: "@membro", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 

        let member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.guild.members.cache.get(args[0]) || message.author

        const author = await client.database.usuarios.findOne({
            idUser: member.id,
        });
  
        let timerep = author.reps.cooldown
        let timerepzinha = 72000000
  
        const rep = author.reps;
        const cooldown = timerepzinha - (Date.now() - timerep);
  
        const ultimaRep = rep.ultimorep == "null" ? "" : await client.users.fetch(rep.ultimorep);
        const ultimoEnvio = rep.ultimoenvio == "null" ? "" : await client.users.fetch(rep.ultimoenvio);
  
       let embedreps = new MessageEmbed()
          .setTitle(`${emojis.developer} | Informações sobre suas reputações`)
          .addFields(
              {  name: `${emojis.setinhadireita}・Total de Reps`, value: `${rep.quantidade == 0 ? `\`Nenhuma\`` : rep.quantidade}` },
              {  name: `${emojis.setinhadireita}・Ultima pessoa que te enviou uma rep`, value: `${rep.ultimorep == "null" ? "\`Ninguém\`" : ultimaRep.tag}` },
              {  name: `${emojis.setinhadireita}・Ultima pessoa que você enviou uma rep`, value: `${rep.ultimoenvio == "null" ? "\`Ninguém\`" : ultimoEnvio.tag}` },
              {  name: `${emojis.setinhadireita}・Cooldown para enviar uma rep nova`, value: `${cooldown < 0 ? "\`Já pode enviar\`" : moment.duration(cooldown).format("h [horas] m [minutos] e s [segundos]").replace("minsutos", "minutos")}` },
          )
          .setThumbnail(message.guild.iconURL({dynamic: true}))
          .setColor(color)
          .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
          .setTimestamp()
        await message.channel.send({ embeds: [embedreps] })

    }
}