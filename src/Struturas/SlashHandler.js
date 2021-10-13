const { readdirSync, lstatSync } = require("fs");
const { SlashCommandBuilder } = require('@discordjs/builders');
const c = require("colors")
const config = require("../Json/config.json");
const dirSetup = config.slashCommandsDirs;

module.exports = (client) => {

    try {
			let allCommands = [];
			readdirSync("./src/Slash/").forEach((dir) => {
				if(lstatSync(`./src/Slash/${dir}`).isDirectory()) {
					const groupName = dir;
					const cmdSetup = dirSetup.find(d=>d.Folder == dir);

					if(cmdSetup && cmdSetup.Folder) {
						const subCommand = new SlashCommandBuilder().setName(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase()).setDescription(String(cmdSetup.CmdDescription));
						const slashCommands = readdirSync(`./src/Slash/${dir}/`).filter((file) => file.endsWith(".js"));
						for (let file of slashCommands) {
							let pull = require(`../Slash/${dir}/${file}`);
							if (pull.name && pull.description) {
								subCommand
								.addSubcommand((subcommand) => {
									subcommand.setName(String(pull.name).toLowerCase()).setDescription(pull.description)
									if(pull.options && pull.options.length > 0){
										for(const option of pull.options){
											if(option.User && option.User.name && option.User.description){
												subcommand.addUserOption((op) =>
													op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
												)
											} else if(option.Integer && option.Integer.name && option.Integer.description){
												subcommand.addIntegerOption((op) =>
													op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
												)
											} else if(option.String && option.String.name && option.String.description){
												subcommand.addStringOption((op) =>
													op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
												)
											} else if(option.Channel && option.Channel.name && option.Channel.description){
												subcommand.addChannelOption((op) =>
													op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
												)
											} else if(option.Role && option.Role.name && option.Role.description){
												subcommand.addRoleOption((op) =>
													op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
												)
											} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
												subcommand.addStringOption((op) =>
													op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
													.addChoices(option.StringChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),String(c[1])] )),
												)
											} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
												subcommand.addStringOption((op) =>
													op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
													.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
												)
											} else {
												console.log(`Falta uma Opção o Nome ou/e a Descrição de ${pull.name}`)
											}
										}
									}
									return subcommand;
								})
								client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + pull.name, pull)
							} else {
								console.log(file, `erro -> falta um help.name, ou help.name não é uma cadeia.`.brightRed);
								continue;
							}
						}

						allCommands.push(subCommand.toJSON());
					} 
					else {
						return console.log(`O Subcommand-Folder ${dir} não se encontra na configuração dirSetup!`);
					}
				} else {
					let pull = require(`../Slash/${dir}`);
					if (pull.name && pull.description) {
						let Command = new SlashCommandBuilder().setName(String(pull.name).toLowerCase()).setDescription(pull.description);
							if(pull.options && pull.options.length > 0){
								for(const option of pull.options){
									if(option.User && option.User.name && option.User.description){
										Command.addUserOption((op) =>
											op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
										)
									} else if(option.Integer && option.Integer.name && option.Integer.description){
										Command.addIntegerOption((op) =>
											op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
										)
									} else if(option.String && option.String.name && option.String.description){
										Command.addStringOption((op) =>
											op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
										)
									} else if(option.Channel && option.Channel.name && option.Channel.description){
										Command.addChannelOption((op) =>
											op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
										)
									} else if(option.Role && option.Role.name && option.Role.description){
										Command.addRoleOption((op) =>
											op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
										)
									} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
										Command.addStringOption((op) =>
											op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
											.addChoices(option.StringChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),String(c[1])] )),
										)
									} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
										Command.addStringOption((op) =>
											op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
											.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
										)
									} else {
										console.log(`Falta uma Opção o Nome ou/e a Descrição de ${pull.name}`)
									}
								}
							}
							allCommands.push(Command.toJSON());
							client.slashCommands.set("normal" + pull.name, pull)
					} 
					else {
						console.log(file, `erro -> falta um help.name, ou help.name não é uma cadeia.`.brightRed);
					}
				}
			});

			client.on("ready", () => {
				client.application.commands.set(allCommands)
				.then(slashCommandsData => {
					console.log(`Aviso foram carregados ${slashCommandsData.size} categorias de / ${`(Com ${slashCommandsData.map(d => d.options).flat().length} Sub-Comandos)`.green} Carregados no total: ${`Em todos os servidores possíveis`.underline}`.brightGreen); 
					console.log(`Uma vez que você está a utilizar definições globais, pode demorar até 1 hora até que os comandos sejam alterados!`.bold.yellow)
				}).catch((e)=>console.log(e));
			})
		
    } catch (e) {
        console.log(`Aconteceu um errinho ${e.stack}`)
    }
};