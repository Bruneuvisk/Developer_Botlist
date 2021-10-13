const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")

module.exports = {
    name: "ping",
    description: "Demonstra a Latência e a API sobre mim!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
          //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
          //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
          //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
          {"StringChoices": { name: "qual_ping", description: "Qual ping você quer saber sobre mim?", required: true, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {
      try{
          const { member, channelId, guildId, applicationId, 
                  commandName, deferred, replied, ephemeral, 
                  options, id, createdTimestamp 
          } = interaction; 
          const { guild } = member;

          const StringOption = options.getString("qual_ping"); 
          
          if(StringOption == "botping") { 
            const embed = new MessageEmbed()
                .setDescription(`${emojis.emojibot} | Pegando o ping...`)
                .setColor(config.color)

            const embedtrue = new MessageEmbed()
                .setDescription(`${emojis.emojicerto} | Ping do Bot: \`${Math.floor((Date.now() - createdTimestamp) - 2 * Math.floor(client.ws.ping))} ms\``)
                .setColor(config.color)

              await interaction.reply({ content: `Carregando...`, embeds: [embed], ephemeral: true });
              interaction.editReply({ content: `🏓 Pong!`, embeds: [embedtrue], ephemeral: true })
          } else {
            const embedtrue = new MessageEmbed()
                .setDescription(`${emojis.emojicerto} | Ping da API: \`${Math.floor(client.ws.ping)} ms\``)
                .setColor(config.color)

            interaction.reply({ content: `🏓 Pong!`, embeds: [embedtrue] , ephemeral: true })
          }
      } catch (e) {
          console.log(`Ocorreu um erro com o comando de ping ${e.stack}`)
      }
    }
  }