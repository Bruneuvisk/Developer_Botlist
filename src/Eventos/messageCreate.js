const { MessageEmbed, Collection } = require("discord.js")
const config = require("../Json/config.json")
const emojis = require("../Json/emojis.json")
const cooldowns = new Collection();
const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);

module.exports = async (client, message) => {

  try {

    if (message.author.bot) return; 

    const server = await client.database.servidores.findOne({
        idServer: message.guild.id,
    });

    const user = await client.database.usuarios.findOne({
        idUser: message.author.id,
    });

    const cliente = await client.database.cliente.findOne({
        _id: client.user.id,
    });

    if (!user) {
        await client.database.usuarios.create({
            idUser: message.author.id,
            tagUser: message.author.tag,
        });
    }

    if (!server) {
        await client.database.servidores.create({ 
            idServer: message.guild.id
        });
    }

    if(!cliente) {
        await client.database.cliente.create({
            _id: client.user.id,
            reason: "",
            manutenção: false,
        });
    }

    let prefix; 
    if (message.channel.type === 'DM') {
        prefix = config.prefix; 
    } else if(!server) {
        prefix = config.prefix;
    } else {
        prefix = server.prefix
    }

    let color = config.color

    if (message.channel.type === 'DM') return

    if (message.content.match(GetMention(client.user.id))) {
       return message.reply({ content: `${emojis.emojicerto} | Olá me chamo **${client.user.username}**, sou um bot totalmente voltado há uma botlist \n ${emojis.emojicerto} | Meu prefixo **dev!** \n ${emojis.emojicerto} | Para ter acesso aos meus comandos use **/info help**`})
    }

    if (message.content.indexOf(prefix) !== 0) return;
    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
        let embedzinha = new MessageEmbed()
            .setDescription(`${emojis.emojierror} | O comando \`${commandName}\` não existe em minha lista de comandos use **/info help** para acessar os comandos!`)
            .setColor(color)
        return message.channel.send({ embeds: [embedzinha] }).then(xxx =>{
          setTimeout(() => xxx.delete(), 15000) 
        })
    };

    if (cliente.blacklist.some((x) => x == message.author.id)) {
        return message.channel.send(`${emojis.emojierror} | ${message.author}, Você está na minha \`Blacklist\`, e não poderá ter acesso aos meus comandos!`)
    }

    if(["avatar", "banner", "botinfo", "help", "ping", "reps", "rep", "docs", "add", "infobot", "vote", "userinfo", "rank", "removerbot", "verificar", "fila"].includes(command.name)) {
       return message.reply({ content: `${emojis.emojierror} | Então eu sou totalmente feito em comandos de **/**. \n\n Então por favor para usar meus comandos use \n \`\`\`/info help\`\`\` \n\n Caso acontença algo entre no meu servidor de suporte: https://discord.gg/3GxgaaMkQs`})
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(command.name); 
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount; 

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;  
            let embedtime = new MessageEmbed() 
                .setDescription(`${emojis.emojitempo} **|** ${message.author}, por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de realizar o comando \`${command.name}\`.`)
                .setColor(color)
            return message.channel.send({ embeds: [embedtime] }).then(xxx =>{
                setTimeout(() => xxx.delete(), 10000) 
            })
        }; 
    }; 

    if (command.MemberPerm && !message.member.permissions.has(command.MemberPerm)) {
      let permissions = [];

      if (command.MemberPerm.includes(Permissions.FLAGS.ADMINISTRATOR)) permissions.push('`Administrador`');
      if (command.MemberPerm.includes(Permissions.FLAGS.VIEW_AUDIT_LOG)) permissions.push('`Ver o registro de auditoria`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_GUILD)) permissions.push('`Gerenciar servidor`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_ROLES)) permissions.push('`Gerenciar cargos`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_CHANNELS)) permissions.push('`Gerenciar canais`');
      if (command.MemberPerm.includes(Permissions.FLAGS.KICK_MEMBERS)) permissions.push('`Expulsar membros`');
      if (command.MemberPerm.includes(Permissions.FLAGS.BAN_MEMBERS)) permissions.push('`Banir membros`');
      if (command.MemberPerm.includes(Permissions.FLAGS.CREATE_INSTANT_INVITE)) permissions.push('`Criar convite`');
      if (command.MemberPerm.includes(Permissions.FLAGS.CHANGE_NICKNAME)) permissions.push('`Alterar apelido`')
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_NICKNAMES)) permissions.push('`Gerenciar apelidos`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) permissions.push('`Gerenciar emojis e stickers`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_WEBHOOKS)) permissions.push('`Gerenciar webhooks`');
      if (command.MemberPerm.includes(Permissions.FLAGS.VIEW_CHANNEL)) permissions.push('`Ler canais de texto e ver canais de voz`');
      if (command.MemberPerm.includes(Permissions.FLAGS.SEND_MESSAGES)) permissions.push('`Enviar mensagens`');
      if (command.MemberPerm.includes(Permissions.FLAGS.SEND_TTS_MESSAGES)) permissions.push('`Enviar mensagens em TTS`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_MESSAGES)) permissions.push('`Gerenciar mensagens`');
      if (command.MemberPerm.includes(Permissions.FLAGS.EMBED_LINKS)) permissions.push('`Inserir links`');
      if (command.MemberPerm.includes(Permissions.FLAGS.ATTACH_FILES)) permissions.push('`Anexar arquivos`');
      if (command.MemberPerm.includes(Permissions.FLAGS.READ_MESSAGE_HISTORY)) permissions.push('`Ver histórico de mensagens`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MENTION_EVERYONE)) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
      if (command.MemberPerm.includes(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) permissions.push('`Usar emojis externos`');
      if (command.MemberPerm.includes(Permissions.FLAGS.ADD_REACTIONS)) permissions.push('`Adicionar reações`');
      if (command.MemberPerm.includes(Permissions.FLAGS.CONNECT)) permissions.push('`Conectar`');
      if (command.MemberPerm.includes(Permissions.FLAGS.SPEAK)) permissions.push('`Falar`');
      if (command.MemberPerm.includes(Permissions.FLAGS.STREAM)) permissions.push('`Vídeo`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MUTE_MEMBERS)) permissions.push('`Silenciar membros`');
      if (command.MemberPerm.includes(Permissions.FLAGS.DEAFEN_MEMBERS)) permissions.push('`Ensurdecer membros`');
      if (command.MemberPerm.includes(Permissions.FLAGS.MOVE_MEMBERS)) permissions.push('`Mover membros`');
      if (command.MemberPerm.includes(Permissions.FLAGS.USE_VAD)) permissions.push('`Usar detecção de voz`');
      if (command.MemberPerm.includes(Permissions.FLAGS.PRIORITY_SPEAKER)) permissions.push('`Voz Prioritária`');
      if (command.MemberPerm.includes(Permissions.FLAGS.VIEW_GUILD_INSIGHTS)) permissions.push('`Ver as Informações do Servidor`'); 
      if (command.MemberPerm.includes(Permissions.FLAGS.USE_APPLICATION_COMMANDS)) permissions.push('`Usar comandos de aplicações`'); 
      if (command.MemberPerm.includes(Permissions.FLAGS.REQUEST_TO_SPEAK)) permissions.push('`Pedir pra Falar`'); 
      if (command.MemberPerm.includes(Permissions.FLAGS.MANAGE_THREADS)) permissions.push('`Gerenciar as threads`');
      if (command.MemberPerm.includes(Permissions.FLAGS.USE_PUBLIC_THREADS)) permissions.push('`Usar threads públicos`');
      if (command.MemberPerm.includes(Permissions.FLAGS.USE_PRIVATE_THREADS)) permissions.push('`Usar threads privados`');

      let embedperms = new MessageEmbed()
          .setTitle(`${emojis.emojierror} | Error de Perms`)
          .setDescription(`${emojis.emojierror} **|** ${message.author}, você não pode executar esse comandos \n Perms Necessárias: ${permissions.join(", ")}.`) 
          .setColor(color)
          .setThumbnail(message.guild.iconURL({dynamic: true}))
          .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
          .setTimestamp()
      return message.channel.send({ embeds: [embedperms] }).then(xxx =>{
          setTimeout(() => xxx.delete(), 15000) 
      })
    };

    if (command.ClientPerm && !message.guild.members.cache.get(client.user.id).permissions.has(command.ClientPerm)) {
      let permissions = [];

      if (command.ClientPerm.includes(Permissions.FLAGS.ADMINISTRATOR)) permissions.push('`Administrador`');
      if (command.ClientPerm.includes(Permissions.FLAGS.VIEW_AUDIT_LOG)) permissions.push('`Ver o registro de auditoria`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_GUILD)) permissions.push('`Gerenciar servidor`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_ROLES)) permissions.push('`Gerenciar cargos`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_CHANNELS)) permissions.push('`Gerenciar canais`');
      if (command.ClientPerm.includes(Permissions.FLAGS.KICK_MEMBERS)) permissions.push('`Expulsar membros`');
      if (command.ClientPerm.includes(Permissions.FLAGS.BAN_MEMBERS)) permissions.push('`Banir membros`');
      if (command.ClientPerm.includes(Permissions.FLAGS.CREATE_INSTANT_INVITE)) permissions.push('`Criar convite`');
      if (command.ClientPerm.includes(Permissions.FLAGS.CHANGE_NICKNAME)) permissions.push('`Alterar apelido`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_NICKNAMES)) permissions.push('`Gerenciar apelidos`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) permissions.push('`Gerenciar emojis e stickers`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_WEBHOOKS)) permissions.push('`Gerenciar webhooks`');
      if (command.ClientPerm.includes(Permissions.FLAGS.VIEW_CHANNEL)) permissions.push('`Ler canais de texto e ver canais de voz`');
      if (command.ClientPerm.includes(Permissions.FLAGS.SEND_MESSAGES)) permissions.push('`Enviar mensagens`');
      if (command.ClientPerm.includes(Permissions.FLAGS.SEND_TTS_MESSAGES)) permissions.push('`Enviar mensagens em TTS`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_MESSAGES)) permissions.push('`Gerenciar mensagens`');
      if (command.ClientPerm.includes(Permissions.FLAGS.EMBED_LINKS)) permissions.push('`Inserir links`');
      if (command.ClientPerm.includes(Permissions.FLAGS.ATTACH_FILES)) permissions.push('`Anexar arquivos`');
      if (command.ClientPerm.includes(Permissions.FLAGS.READ_MESSAGE_HISTORY)) permissions.push('`Ver histórico de mensagens`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MENTION_EVERYONE)) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
      if (command.ClientPerm.includes(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) permissions.push('`Usar emojis externos`');
      if (command.ClientPerm.includes(Permissions.FLAGS.ADD_REACTIONS)) permissions.push('`Adicionar reações`');
      if (command.ClientPerm.includes(Permissions.FLAGS.CONNECT)) permissions.push('`Conectar`');
      if (command.ClientPerm.includes(Permissions.FLAGS.SPEAK)) permissions.push('`Falar`');
      if (command.ClientPerm.includes(Permissions.FLAGS.STREAM)) permissions.push('`Vídeo`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MUTE_MEMBERS)) permissions.push('`Silenciar membros`');
      if (command.ClientPerm.includes(Permissions.FLAGS.DEAFEN_MEMBERS)) permissions.push('`Ensurdecer membros`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MOVE_MEMBERS)) permissions.push('`Mover membros`');
      if (command.ClientPerm.includes(Permissions.FLAGS.USE_VAD)) permissions.push('`Usar detecção de voz`');
      if (command.ClientPerm.includes(Permissions.FLAGS.PRIORITY_SPEAKER)) permissions.push('`Voz Prioritária`');
      if (command.ClientPerm.includes(Permissions.FLAGS.VIEW_GUILD_INSIGHTS)) permissions.push('`Ver as Informações do Servidor`');
      if (command.ClientPerm.includes(Permissions.FLAGS.USE_APPLICATION_COMMANDS)) permissions.push('`Usar comandos de aplicações`'); 
      if (command.ClientPerm.includes(Permissions.FLAGS.REQUEST_TO_SPEAK)) permissions.push('`Pedir pra Falar`');
      if (command.ClientPerm.includes(Permissions.FLAGS.MANAGE_THREADS)) permissions.push('`Gerenciar as threads`'); 
      if (command.ClientPerm.includes(Permissions.FLAGS.USE_PUBLIC_THREADS)) permissions.push('`Usar threads públicos`');
      if (command.ClientPerm.includes(Permissions.FLAGS.USE_PRIVATE_THREADS)) permissions.push('`Usar threads privados`');

      let embedperms = new MessageEmbed() 
          .setTitle(`${emojis.emojierror} | Error de Perms`)
          .setDescription(`${emojis.emojierror} **|** ${message.author}, eu não tenho permição de realizar este comando \n Perms Necessárias: ${permissions.join(", ")}.`) 
          .setColor(color)
          .setThumbnail(message.guild.iconURL({dynamic: true}))
          .setFooter(`${message.guild.name} | Developer BOT`, message.guild.iconURL({dynamic: true}))
          .setTimestamp()
      return message.channel.send({ embeds: [embedperms] }).then(xxx =>{
          setTimeout(() => xxx.delete(), 15000) 
      })
    };

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    command.execute(client, message, args, config, emojis, color, prefix);
  } catch (err) {
    if (err) console.error(err);
  }
}