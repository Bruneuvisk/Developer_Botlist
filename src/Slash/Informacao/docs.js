const { MessageEmbed, Permissions, MessageActionRow, MessageSelectMenu } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")
const axios = require("axios")

module.exports = {
    name: "docs",
    description: "Lista alguma documentação sobre o discord.js!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          {"String": { name: "documento", description: "Escolha algum documento para eu buscar?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
          //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
          //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
          //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
          //{"StringChoices": { name: "nome_comando", description: "Se quiser escolha um comando para exibir informações sobre o mesmo.", required: false, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {

        const { member, channelId, guildId, applicationId, 
            commandName, deferred, replied, ephemeral, 
            options, id, createdTimestamp 
        } = interaction; 
        const { guild } = member;

        const args = options.getString("documento")

        const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
          args
        )}`;
    
        axios.get(url).then(({ data }) => {
          if (data) {
            interaction.reply({ embeds: [data] });
          }
        });

    }
}