const { MessageEmbed, WebhookClient, Collection, Permissions } = require("discord.js")
const config = require("../Json/config.json")
const emojis = require("../Json/emojis.json")
const cooldowns = new Collection();
const moment = require("moment");
moment.locale("pt-br")
require("moment-duration-format");

module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;

  const CategoryName = interaction.commandName;
	let command = false;

	if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
		command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand());
	}

	if (client.slashCommands.has("normal" + CategoryName)) {
		command = client.slashCommands.get("normal" + CategoryName);
	}

  const cliente = await client.database.cliente.findOne({
    _id: client.user.id,
  });

	if(command) {

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    };

    const now = Date.now();
    const timestamps = cooldowns.get(command.name); 
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.member.id)) {
        const expirationTime = timestamps.get(interaction.member.id) + cooldownAmount; 

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;  
            let embedtime = new MessageEmbed() 
                .setDescription(`${emojis.emojitempo} **|** <@${interaction.member.id}>, por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de realizar o comando \`${command.name}\`.`)
                .setColor(config.color)
                .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
                .setTimestamp()
            return interaction.reply({ ephemeral: true, embeds: [embedtime] })
        }; 
    }; 

        if (cliente.blacklist.some((x) => x == interaction.member.id)) {
            return interaction.reply({ ephemeral: true, content: `${emojis.emojierror} | ${interaction.member}, Você está na minha \`Blacklist\`, e não poderá ter acesso aos meus comandos!` })
        }
      
        if (command.memberperm && !interaction.member.permissions.has(command.memberperm)) {
          let permissions = [];

          if (command.memberperm.includes(Permissions.FLAGS.ADMINISTRATOR)) permissions.push('`Administrador`');
          if (command.memberperm.includes(Permissions.FLAGS.VIEW_AUDIT_LOG)) permissions.push('`Ver o registro de auditoria`');
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_GUILD)) permissions.push('`Gerenciar servidor`');
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_ROLES)) permissions.push('`Gerenciar cargos`');
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_CHANNELS)) permissions.push('`Gerenciar canais`');
          if (command.memberperm.includes(Permissions.FLAGS.KICK_MEMBERS)) permissions.push('`Expulsar membros`');
          if (command.memberperm.includes(Permissions.FLAGS.BAN_MEMBERS)) permissions.push('`Banir membros`');
          if (command.memberperm.includes(Permissions.FLAGS.CREATE_INSTANT_INVITE)) permissions.push('`Criar convite`');
          if (command.memberperm.includes(Permissions.FLAGS.CHANGE_NICKNAME)) permissions.push('`Alterar apelido`')
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_NICKNAMES)) permissions.push('`Gerenciar apelidos`');
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) permissions.push('`Gerenciar emojis e stickers`');
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_WEBHOOKS)) permissions.push('`Gerenciar webhooks`');
          if (command.memberperm.includes(Permissions.FLAGS.VIEW_CHANNEL)) permissions.push('`Ler canais de texto e ver canais de voz`');
          if (command.memberperm.includes(Permissions.FLAGS.SEND_MESSAGES)) permissions.push('`Enviar mensagens`');
          if (command.memberperm.includes(Permissions.FLAGS.SEND_TTS_MESSAGES)) permissions.push('`Enviar mensagens em TTS`');
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_MESSAGES)) permissions.push('`Gerenciar mensagens`');
          if (command.memberperm.includes(Permissions.FLAGS.EMBED_LINKS)) permissions.push('`Inserir links`');
          if (command.memberperm.includes(Permissions.FLAGS.ATTACH_FILES)) permissions.push('`Anexar arquivos`');
          if (command.memberperm.includes(Permissions.FLAGS.READ_MESSAGE_HISTORY)) permissions.push('`Ver histórico de mensagens`');
          if (command.memberperm.includes(Permissions.FLAGS.MENTION_EVERYONE)) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
          if (command.memberperm.includes(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) permissions.push('`Usar emojis externos`');
          if (command.memberperm.includes(Permissions.FLAGS.ADD_REACTIONS)) permissions.push('`Adicionar reações`');
          if (command.memberperm.includes(Permissions.FLAGS.CONNECT)) permissions.push('`Conectar`');
          if (command.memberperm.includes(Permissions.FLAGS.SPEAK)) permissions.push('`Falar`');
          if (command.memberperm.includes(Permissions.FLAGS.STREAM)) permissions.push('`Vídeo`');
          if (command.memberperm.includes(Permissions.FLAGS.MUTE_MEMBERS)) permissions.push('`Silenciar membros`');
          if (command.memberperm.includes(Permissions.FLAGS.DEAFEN_MEMBERS)) permissions.push('`Ensurdecer membros`');
          if (command.memberperm.includes(Permissions.FLAGS.MOVE_MEMBERS)) permissions.push('`Mover membros`');
          if (command.memberperm.includes(Permissions.FLAGS.USE_VAD)) permissions.push('`Usar detecção de voz`');
          if (command.memberperm.includes(Permissions.FLAGS.PRIORITY_SPEAKER)) permissions.push('`Voz Prioritária`');
          if (command.memberperm.includes(Permissions.FLAGS.VIEW_GUILD_INSIGHTS)) permissions.push('`Ver as Informações do Servidor`'); 
          if (command.memberperm.includes(Permissions.FLAGS.USE_APPLICATION_COMMANDS)) permissions.push('`Usar comandos de aplicações`'); 
          if (command.memberperm.includes(Permissions.FLAGS.REQUEST_TO_SPEAK)) permissions.push('`Pedir pra Falar`'); 
          if (command.memberperm.includes(Permissions.FLAGS.MANAGE_THREADS)) permissions.push('`Gerenciar as threads`');
          if (command.memberperm.includes(Permissions.FLAGS.USE_PUBLIC_THREADS)) permissions.push('`Usar threads públicos`');
          if (command.memberperm.includes(Permissions.FLAGS.USE_PRIVATE_THREADS)) permissions.push('`Usar threads privados`');

          let embedperms = new MessageEmbed()
              .setTitle(`${emojis.emojierror} | Error de Perms`)
              .setDescription(`${emojis.emojierror} **|** <@${interaction.member.id}>, você não pode executar esse comandos \n Perms Necessárias: ${permissions.join(", ")}.`) 
              .setColor(config.color)
              .setThumbnail(interaction.guild.iconURL({dynamic: true}))
              .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
              .setTimestamp()
          return interaction.reply({ ephemeral: true, embeds: [embedperms] })
        };

        if (command.clientperm && !interaction.guild.members.cache.get(client.user.id).permissions.has(command.clientperm)) {
          let permissions = [];

          if (command.clientperm.includes(Permissions.FLAGS.ADMINISTRATOR)) permissions.push('`Administrador`');
          if (command.clientperm.includes(Permissions.FLAGS.VIEW_AUDIT_LOG)) permissions.push('`Ver o registro de auditoria`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_GUILD)) permissions.push('`Gerenciar servidor`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_ROLES)) permissions.push('`Gerenciar cargos`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_CHANNELS)) permissions.push('`Gerenciar canais`');
          if (command.clientperm.includes(Permissions.FLAGS.KICK_MEMBERS)) permissions.push('`Expulsar membros`');
          if (command.clientperm.includes(Permissions.FLAGS.BAN_MEMBERS)) permissions.push('`Banir membros`');
          if (command.clientperm.includes(Permissions.FLAGS.CREATE_INSTANT_INVITE)) permissions.push('`Criar convite`');
          if (command.clientperm.includes(Permissions.FLAGS.CHANGE_NICKNAME)) permissions.push('`Alterar apelido`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_NICKNAMES)) permissions.push('`Gerenciar apelidos`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) permissions.push('`Gerenciar emojis e stickers`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_WEBHOOKS)) permissions.push('`Gerenciar webhooks`');
          if (command.clientperm.includes(Permissions.FLAGS.VIEW_CHANNEL)) permissions.push('`Ler canais de texto e ver canais de voz`');
          if (command.clientperm.includes(Permissions.FLAGS.SEND_MESSAGES)) permissions.push('`Enviar mensagens`');
          if (command.clientperm.includes(Permissions.FLAGS.SEND_TTS_MESSAGES)) permissions.push('`Enviar mensagens em TTS`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_MESSAGES)) permissions.push('`Gerenciar mensagens`');
          if (command.clientperm.includes(Permissions.FLAGS.EMBED_LINKS)) permissions.push('`Inserir links`');
          if (command.clientperm.includes(Permissions.FLAGS.ATTACH_FILES)) permissions.push('`Anexar arquivos`');
          if (command.clientperm.includes(Permissions.FLAGS.READ_MESSAGE_HISTORY)) permissions.push('`Ver histórico de mensagens`');
          if (command.clientperm.includes(Permissions.FLAGS.MENTION_EVERYONE)) permissions.push('`Mencionar @everyone, @here e todos os cargos`');
          if (command.clientperm.includes(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) permissions.push('`Usar emojis externos`');
          if (command.clientperm.includes(Permissions.FLAGS.ADD_REACTIONS)) permissions.push('`Adicionar reações`');
          if (command.clientperm.includes(Permissions.FLAGS.CONNECT)) permissions.push('`Conectar`');
          if (command.clientperm.includes(Permissions.FLAGS.SPEAK)) permissions.push('`Falar`');
          if (command.clientperm.includes(Permissions.FLAGS.STREAM)) permissions.push('`Vídeo`');
          if (command.clientperm.includes(Permissions.FLAGS.MUTE_MEMBERS)) permissions.push('`Silenciar membros`');
          if (command.clientperm.includes(Permissions.FLAGS.DEAFEN_MEMBERS)) permissions.push('`Ensurdecer membros`');
          if (command.clientperm.includes(Permissions.FLAGS.MOVE_MEMBERS)) permissions.push('`Mover membros`');
          if (command.clientperm.includes(Permissions.FLAGS.USE_VAD)) permissions.push('`Usar detecção de voz`');
          if (command.clientperm.includes(Permissions.FLAGS.PRIORITY_SPEAKER)) permissions.push('`Voz Prioritária`');
          if (command.clientperm.includes(Permissions.FLAGS.VIEW_GUILD_INSIGHTS)) permissions.push('`Ver as Informações do Servidor`');
          if (command.clientperm.includes(Permissions.FLAGS.USE_APPLICATION_COMMANDS)) permissions.push('`Usar comandos de aplicações`'); 
          if (command.clientperm.includes(Permissions.FLAGS.REQUEST_TO_SPEAK)) permissions.push('`Pedir pra Falar`');
          if (command.clientperm.includes(Permissions.FLAGS.MANAGE_THREADS)) permissions.push('`Gerenciar as threads`'); 
          if (command.clientperm.includes(Permissions.FLAGS.USE_PUBLIC_THREADS)) permissions.push('`Usar threads públicos`');
          if (command.clientperm.includes(Permissions.FLAGS.USE_PRIVATE_THREADS)) permissions.push('`Usar threads privados`');

          let embedperms = new MessageEmbed() 
              .setTitle(`${emojis.emojierror} | Error de Perms`)
              .setDescription(`${emojis.emojierror} **|** <@${interaction.member.id}>, eu não tenho permição de realizar este comando \n Perms Necessárias: ${permissions.join(", ")}.`) 
              .setColor(config.color)
              .setThumbnail(interaction.guild.iconURL({dynamic: true}))
              .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
              .setTimestamp()
          return interaction.reply({ ephemeral: true, embeds: [embedperms] })
        };

        if (command.requiredroles && command.requiredroles.length > 0 && interaction.member.roles.cache.size > 0 && !interaction.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
          let embedroles = new MessageEmbed()
            .setTitle(`${emojis.emojierror} | Error`)
            .setDescription(`${emojis.emojierror}・Para realizar este comando você precisa ter os cargos requisitados!: \n ${emojis.setinhadireita}・Cargos Necessários: ${command && command.requiredroles ? command.requiredroles.map(v => `<@&${v}>`).join(",") : "**Nenhum Cargo**"}`)
            .setColor(config.color)
            .setThumbnail(interaction.guild.iconURL({dynamic: true}))
            .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
            .setTimestamp()
          return interaction.reply({ ephemeral: true, embeds: [embedroles] })
        }

        if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(interaction.member.id)) {
          let embedmembers = new MessageEmbed()
              .setTitle(`${emojis.emojierror} | Error`)
              .setDescription(`${emojis.emojierror}・Então este comando só pode ser usado em minha lista de usuários permitidos!: \n ${emojis.setinhadireita}・Usuários permitidos: ${command && command.alloweduserids ? command.alloweduserids.map(v => `<@${v}>`).join(",") : "**Nenhum Usuário**"}`)
              .setColor(config.color)
              .setThumbnail(interaction.guild.iconURL({dynamic: true}))
              .setFooter(`${interaction.guild.name} | Developer BOT`, interaction.guild.iconURL({dynamic: true}))
              .setTimestamp()
          return interaction.reply({ ephemeral: true, embeds: [embedmembers]})
        }

    timestamps.set(interaction.member.id, now);
    setTimeout(() => timestamps.delete(interaction.member.id), cooldownAmount);

		command.run(client, interaction, interaction.member, interaction.guild)

      const Webhook = new WebhookClient({
        id: "896589112637784075",
        token: "NXo2HmQ9CinQ8Ruwivmni72n_ChZd9CFBbIhjqi9QDk9yDc0qOvCNTfXbSCblkJ9XRY_"
      });

      const EMBED_COMMANDS = new MessageEmbed()
          .setAuthor(`Logs de Comandos do Bot`, client.user.displayAvatarURL())
          .addFields(
            {
              name: `Servidor que foi Usado`,
              value: `**${interaction.guild.name}** \`( ${interaction.guild.id} )\``,
            },
            {
              name: `Author do Comando`,
              value: `**${interaction.member.user.tag}** \`( ${interaction.member.id} )\``,
            },
            {
              name: `Data da Execução`,
              value: moment(Date.now()).format("L LT"),
            },
            {
              name: `Comando Executado`,
              value: `**\`${command.name}\`**`,
            }
          )
          .setTimestamp()
          .setColor(config.color)
          .setFooter(interaction.member.id, interaction.member.user.displayAvatarURL({ dynamic: true }))
          .setThumbnail(client.user.displayAvatarURL({ format: "jpg", size: 2048 }));
      Webhook.send({ embeds: [EMBED_COMMANDS] });

    }
}