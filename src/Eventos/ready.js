const c = require('colors')
const Guild = require("../Database/Schemas/Guild")
const User = require("../Database/Schemas/User")
const Bot = require("../Database/Schemas/Bot")
const Client = require("../Database/Schemas/Client")

module.exports = async (client) => {

    const ping = new Date();  
    ping.setHours(ping.getHours() - 3);

    client.database.servidores = Guild;
    client.database.usuarios = User;
    client.database.bots = Bot;
    client.database.cliente = Client;

    
    let status = [
        {name: `👥 ${client.users.cache.size} developers em meu uso`, type: 'WATCHING'},
        {name: `🤖 discord.gg/3GxgaaMkQs Servidor de suporte`, type: "WATCHING"},
        {name: '☠️ Meu criador: ! RD ๖ۣۜBruno#1000', type: "WATCHING"},
        {name: '🔗 Tenho várias funções e funciono como uma botlist', type: "WATCHING"}, 
        {name: `👑 Sou público porem trabalho somente eu meu servidor`, type: "PLAYING"},
        {name: `⚡ Para ter acesso aos meus comandos use /info help`, type: 'WATCHING'},
    ]
  
    function setStatus() {
        let randomStatus = status[Math.floor(Math.random()*status.length)]
        client.user.setPresence({ activities: [randomStatus] })
    };

    setStatus();
    setInterval(() => setStatus(), 35000);

    console.log(c.blue(`[LOGIN] - O bot ${client.user.username} foi inicializado com ${client.guilds.cache.size} servidores e com ${client.users.cache.size} usuários`))
}