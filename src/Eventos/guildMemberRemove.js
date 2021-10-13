const { MessageEmbed, Collection, Permissions } = require("discord.js")
const config = require("../Json/config.json")
const emojis = require("../Json/emojis.json")

module.exports = async (client, member) => {
    let guild = member.guild

    if(guild.id === "525178633707323393") {
        const userzinho = await client.database.usuarios.findOne(
            { idUser: member.id }
        )

        if(!userzinho) return

        let botslist = userzinho.botlist.bots

        if(botslist.length >= 1) {
            if(userzinho) {
                await deletebotsMember(client, botslist, member)
            }
        }

        if(member.user.bot == true) {
            const botzin = await client.database.bots.findOne({ idBot: member.id });

            if(botzin) {
                let guild_dev = client.guilds.cache.get("525178633707323393")
                let channelslogs = guild_dev.channels.cache.get("893169793530744893")
                let memberowner = await client.users.fetch(botzin.idOwner)

                let embedremovido = new MessageEmbed()
                    .setTitle(`${emojis.emojierror} | Aviso: Seu bot ${member.user.username}#${member.user.discriminator} saiu do servidor oficial, caso não foi você ou ocorreu algum equivoco, avise-nós!`)
                    .setColor(config.color)
                    .setThumbnail(member.user.avatarURL())
                    .setFooter(`${memberowner.username}#${memberowner.discriminator}`, memberowner.displayAvatarURL({ dynamic: true }))
                channelslogs.send({ content: `<@${botzin.idOwner}>`, embeds: [embedremovido] })

                await client.database.usuarios.findOneAndUpdate(
                    { idUser: botzin.idOwner },
                    { $pull: { "botlist.bots": member.id } }
                )

                await botzin.deleteOne()
            }
        }

    }
}

async function deletebotsMember(client, array, member) {
    for (const bot of array) {
        const doc = await client.database.bots.findOne({ idBot: bot });

        if(doc) {
            let guild = client.guilds.cache.get("525178633707323393")
            let botsguild = guild.members.cache.get(doc.idBot)

            await client.database.usuarios.findOneAndUpdate(
                { idUser: member.id },
                { $pull: { "botlist.bots": doc.idBot } }
            )

            botsguild.kick("O dono do bot saiu do servidor")

            await doc.deleteOne()
        }
      }
}