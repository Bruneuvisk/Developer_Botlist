const { MessageEmbed, Collection, Permissions } = require("discord.js")
const config = require("../Json/config.json")
const emojis = require("../Json/emojis.json")

module.exports = async (client, member) => {
    let guild = member.guild

    if(guild.id === "525178633707323393") {
        if(member.user.bot == true) {
            member.roles.add("894579721935937636", "Autorole Bot")
        } else {
            member.roles.add("871835046665916466", "Autorole Membro")
        }
    }

}