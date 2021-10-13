const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "rep",
    description: "Da uma reputação para um membro!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "membro", description: "Qual membro deseja enviar uma rep?", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
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

        await guild.members.fetch()
        const membroo = guild.members.cache.get(UserOption.id);

        const author = await client.database.usuarios.findOne({
            idUser: interaction.member.id,
        });
  
        const membro = await client.database.usuarios.findOne({
            idUser: membroo.id,
        });
  
        let timerep = author.reps.cooldown
        let timerepzinha = 72000000
  
        if (timerep !== null && timerepzinha - (Date.now() - timerep) > 0) {
              let time = moment.duration(timerepzinha - (Date.now() - timerep)).format("h [horas], m [minutos] e s [segundos]").replace("minsutos", "minutos")
  
              let embednopp = new MessageEmbed()
                  .setDescription(`${emojis.emojierror} | Você deu uma rep recentemente aguarde para enviar de novo em **${time}**!`)
                  .setColor(config.color)
                  .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                  .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                  .setTimestamp()
              return interaction.reply({ ephemeral: true, embeds: [embednopp] })
        }
  
        if(membroo.id === interaction.member.id) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | Você não pode se auto-dar-rep cara!`})
        }
  
        if(membroo.bot) {
            return interaction.reply({ ephemeral: true, content:`${emojis.emojierror} | Você não pode dar rep para um bot!`})
        }
  
        if(!membro) {
           return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | O membro citado não está registrado no meu banco de dados!` })
        }
  
        let embedreps = new MessageEmbed()
          .setDescription(`${emojis.emojicerto} | Parabéns ${interaction.member}, você acabou de dar uma **reputação** para o ${membroo}!`)
          .setColor(config.color)
        interaction.reply({ embeds: [embedreps] })
  
        await client.database.usuarios.findOneAndUpdate(
          { idUser: interaction.member.id },
          { $set: { 
              "reps.ultimoenvio": membroo.id,
              "reps.cooldown": Date.now(), 
          } }
        );
  
        await client.database.usuarios.findOneAndUpdate(
          { idUser: membroo.id },
          { $set: { 
              "reps.ultimorep": interaction.member.id,
              "reps.quantidade": membro.reps.quantidade + 1,
          } }
        );
    }
}