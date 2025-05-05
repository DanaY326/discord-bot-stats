const { SlashCommandBuilder, MessageFlags, Client } = require('discord.js');
const sql = require("mssql");
const guildId = require("../../config.json");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('import')
		.setDescription('Imports all data from the server!'),
	async execute(interaction) {
		const memberCount = `${interaction.guild.memberCount}`;
		try {
			console.log(client);
			//let channel = `${interaction.guild.name}`;
			//console.log(channel);
			let channel = client.channels.cache.get(guildId);
			let msgs = [];
			console.log(channel);
			channel.messages.fetch({ limit: 1 })
			.then(messages => {
				let lastMessage = messages.first();
				
				if (!lastMessage.author.bot) {
				  // The author of the last message wasn't a bot
					console.log(lastMessage);
					return interaction.reply(`bldjfsdlkfs${lastMessage}`);  // Print all messages
				}
			  })
			console.log(msgs);
			return await interaction.reply(`bldjfsdlkfs${msgs}`);  // Print all messages
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		//return interaction.reply('Whoa');
		
	},
};