const { MessageEmbed, Permissions } = require("discord.js")
const config = require("../../Json/config.json")
const emojis = require("../../Json/emojis.json")

module.exports = {
    name: "rank",
    description: "Exibe os ranks que possuo em meus sistemas!",
    cooldown: 10,
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
          {"StringChoices": { name: "qual_rank", description: "Qual rank você deseja visualizar?", required: true, choices: [["Reps", "rankreps"], ["Votos", "rankvotos"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {
        const { member, channelId, guildId, applicationId, 
            commandName, deferred, replied, ephemeral, 
            options, id, createdTimestamp 
        } = interaction; 
        const { guild } = member;

        const StringOption = options.getString("qual_rank");

        if(StringOption == "rankreps") {
            const totalreps = await require("mongoose")
                              .connection.collection("membros")
                              .find({ "reps.quantidade": { $gt: 0 } })
                              .toArray();

            const totalrepszinha = Object.entries(totalreps)
                            .map(([, x]) => x.idUser)
                            .slice(0, 10);

            let array = [];

            await pushrepsMembers(client, totalrepszinha, array)

            const repsMap = array.map((x) => x).sort((x, f) => f.reps - x.reps);

            const embed = new MessageEmbed()
                .setTitle(`${emojis.developer} - Rank de Reputações`)
                .setDescription(`${repsMap.map((x, f) => `\`${f + 1}º\` **|** **${x.user}** - Reputações: \`${require("currency-formatter").format(x.reps, { code: "de-DE", symbol: "", precision: 0})}\``).join("\n")}`)
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            await interaction.reply({ embeds: [embed] })
        } else {
            const totalvotos = await require("mongoose")
                             .connection.collection("bots")
                             .find({ voto: { $gt: 0 } })
                             .toArray();

            const totalvotoszinho = Object.entries(totalvotos)
                    .map(([, x]) => x.idBot)
                    .slice(0, 10);

            let array = [];

            await pushvotsBots(client, totalvotoszinho, array)

            const votosMap = array.map((x) => x).sort((x, f) => f.votes - x.votes);

            const embed = new MessageEmbed()
                .setTitle(`${emojis.developer} - Rank de Votos`)
                .setDescription(`${votosMap.map((x, f) => `\`${f + 1}º\` **|** **${x.bot}** - Total de Votos: \`${require("currency-formatter").format(x.votes, { code: "de-DE", symbol: "", precision: 0})}\``).join("\n")}`)
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            await interaction.reply({ embeds: [embed] })

        }


        async function pushrepsMembers(client, reps, members) {
            for (const member of reps) {
                const doc = await client.database.membros.findOne({ idUser: member });
          
                members.push({
                  user: doc.tagUser,
                  reps: doc.reps.quantidade,
                });
            }
        }

        async function pushvotsBots(client, votos, bots) {
            for (const bot of votos) {
                const doc = await client.database.bots.findOne({ idBot: bot });
                const tagzinha = await client.users.fetch(doc.idBot)
          
                bots.push({
                  bot: `${tagzinha.username}#${tagzinha.discriminator}`,
                  votes: doc.voto,
                });
            }
        }

    }

}