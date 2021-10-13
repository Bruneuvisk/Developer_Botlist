const { MessageButton, MessageSelectMenu, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "rep", 
    description: "Da uma reputação para um membro!", 
    aliases: [""], 
    category: "🔰 Miscellaneous",
    usage: "@membro", 
    MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
    ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    cooldown: 3,
    async execute(client, message, args, config, emojis, color, prefix){ 
        message.delete()

        let member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.guild.members.cache.get(args[0])
  
        const author = await client.database.usuarios.findOne({
            idUser: message.author.id,
        });
  
        const membro = await client.database.usuarios.findOne({
            idUser: member.id,
        });
  
        let timerep = author.reps.cooldown
        let timerepzinha = 72000000
  
        if (timerep !== null && timerepzinha - (Date.now() - timerep) > 0) {
              let time = moment.duration(timerepzinha - (Date.now() - timerep)).format("h [horas], m [minutos] e s [segundos]").replace("minsutos", "minutos")
  
              let embednopp = new MessageEmbed()
                  .setDescription(`${emojis.emojierror} | Você deu uma rep recentemente aguarde para enviar de novo em **${time}**!`)
                  .setColor(color)
                  .setThumbnail(message.guild.iconURL({dynamic: true}))
                  .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
                  .setTimestamp()
              return message.channel.send({ embeds: [embednopp] }).then(xxx =>{
                  setTimeout(() => xxx.delete(), 8000) 
              })
        }
  
        if(!member) {
          return message.channel.send(`${emojis.emojierror} | Você precisa marcar um membro para dar uma rep!`).then(xxx =>{
              setTimeout(() => xxx.delete(), 8000) 
          })
        }
  
        if(member.id === message.author.id) {
          return message.channel.send(`${emojis.emojierror} | Você não pode se auto-dar-rep cara!`).then(xxx =>{
              setTimeout(() => xxx.delete(), 8000) 
          })
        }
  
        if(member.bot) {
            return message.channel.send(`${emojis.emojierror} | Você não pode dar rep para um bot!`).then(xxx =>{
              setTimeout(() => xxx.delete(), 8000) 
            })
        }
  
        if(!membro) {
           return message.channel.send(`${emojis.emojierror} | O membro citado não está registrado no meu banco de dados!`).then(xxx =>{
              setTimeout(() => xxx.delete(), 8000) 
           })
        }
  
        let embedreps = new MessageEmbed()
          .setDescription(`${emojis.emojicerto} | Parabéns ${message.author}, você acabou de dar uma **reputação** para o ${member}!`)
          .setColor(color)
        message.channel.send({ embeds: [embedreps] }).then(xxx =>{
          setTimeout(() => xxx.delete(), 15000) 
        })
  
        await client.database.usuarios.findOneAndUpdate(
          { idUser: message.author.id },
          { $set: { 
              "reps.ultimoenvio": member.id,
              "reps.cooldown": Date.now(), 
          } }
        );
  
        await client.database.usuarios.findOneAndUpdate(
          { idUser: member.id },
          { $set: { 
              "reps.ultimorep": message.author.id,
              "reps.quantidade": membro.reps.quantidade + 1,
          } }
        );
    }
}