const { SlashCommandBuilder, MessageFlags, Client, Message, TextChannel } = require('discord.js');
const sql = require("mssql");
const { guildId } = require("../../config.json");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('import')
		.setDescription('Imports all data from the server!'),
	async execute(interaction) {
		await interaction.deferReply();
		const memberCount = `${interaction.guild.memberCount}`;
		try {
			let guildIdReal = interaction.guild.id;
			let msgs = [];
			let usrs = [];
			let dts = [];
			let channels = client.channels.cache.filter(ch => {
				return ch.guild.id === guildIdReal && ch.lastMessageId != null;
			})

			for await (let channelArr of channels) {
				const channel = channelArr[1];
				let ptr = channel.lastMessageId;

				do {
					await channel.messages
						.fetch({ limit: 100, before: ptr.id })
						.then(messages => {
							messages.forEach(message => {
								if (!message.author.bot) {
									msgs.push(message.content);
									usrs.push(message.author.username);
									const dt = new Date(message.createdTimestamp * 1000).toString();
									dts.push(dt);
								} 
							})
							ptr = 0 < messages.size ? messages.at(messages.size - 1) : null;
						});
						
				} while (ptr);
			}

			//console.log(msgs + " \n" + usrs + " \n" + dts);
			interaction.editReply(`Messages:\n${dts}`);  // Print all messages
			return;
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            interaction.editReply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		//return interaction.reply('Whoa');
		
	},
};