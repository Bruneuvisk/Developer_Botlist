const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = {
    name: "reps",
    description: "Mostra as suas reputações!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "membro", description: "Qual membro deseja ver as reps?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
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
        if(!UserOption) UserOption = member.user;

        await guild.members.fetch()
        const membro = guild.members.cache.get(UserOption.id);

        const author = await client.database.usuarios.findOne({
            idUser: membro.id,
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
          .setThumbnail(interaction.guild.iconURL({dynamic: true}))
          .setColor(config.color)
          .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
          .setTimestamp()
        await interaction.reply({ embeds: [embedreps] })

    }
}