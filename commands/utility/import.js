const { SlashCommandBuilder, MessageFlags, Client, Message } = require('discord.js');
const sql = require("mssql");
const { guildId } = require("../../config.json");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('import')
		.setDescription('Imports all data from the server!'),
	async execute(interaction) {
		const memberCount = `${interaction.guild.memberCount}`;
		try {
			//console.log(client);
			let guildIdReal = interaction.guild.id;
			/*console.log(interaction.guild);
			console.log("=-=-=-=-=-=-=");
			console.log(interaction.guild.id);*/
			//console.log(channel);
			let channel = client.channels.cache.get('1358621798195003606');
			let msgs = [];
			let usrs = [];
			let dts = [];
			//console.log("=-=-=-=-=-=-=");
			//console.log(client.channels.cache);
			//console.log(channel);

			await interaction.deferReply();

			let ptr = await channel.messages.fetch({ limit: 1 })
				.then(messages => (messages.size === 1 ? messages.first() : null));

			while (ptr) {
				await channel.messages
					.fetch({ limit: 100, before: ptr.id })
					.then(messages => {
						messages.forEach(message => {
							if (!message.author.bot) {
								msgs.push(message.content);
								usrs.push(message.author.username);
								dts.push(message.createdTimestamp);
							} 
						})
						ptr = 0 < messages.size ? messages.at(messages.size - 1) : null;
					});
			}

			//console.log(msgs + " \n" + usrs + " \n" + dts);
			interaction.editReply(`Messages:\n${msgs}`);  // Print all messages
			return;
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		//return interaction.reply('Whoa');
		
	},
};