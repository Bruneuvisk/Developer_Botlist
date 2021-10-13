const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")

module.exports = {
    name: "avatar",
    description: "Lista o avatar de algum membro!",
    cooldown: 3,
    memberperm: [Permissions.FLAGS.SEND_MESSAGES], 
    clientperm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
    requiredroles: [],
    alloweduserids: [],
    options: [
          //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
          //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
          {"User": { name: "membro", description: "Qual membro deseja pegar o avatar?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
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

        const avatar = membro.user.displayAvatarURL({
            dynamic: true,
            size: 2048,
        });

        let embedav = new MessageEmbed()
            .setTitle(`${emojis.emojiusers} | Avatar do: ${membro.user.username}#${membro.user.discriminator}`)
            .setDescription(`**Clique **[aqui](${avatar})** para baixar o avatar.**`)
            .setColor(config.color)
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setImage(avatar)
        await interaction.reply({ embeds: [embedav] })

    }
}