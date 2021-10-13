const { MessageEmbed, Collection, Permissions } = require("discord.js")
const config = require("../Json/config.json")
const emojis = require("../Json/emojis.json")
const cooldowns = new Collection();

module.exports = async (client, thread) => {
    if(thread.joinable()) {
        try{
            await thread.join();
        } catch (e) {
            console.log(e)
        }
    }
}