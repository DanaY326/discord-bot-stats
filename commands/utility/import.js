const { SlashCommandBuilder, MessageFlags, Client } = require('discord.js');
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
			//console.log("=-=-=-=-=-=-=");
			//console.log(client.channels.cache);
			//console.log(channel);
			await channel.messages.fetch({ limit: 100 })
			.then(messages => {
				//console.log(messages);
				messages.forEach(message => {
					//console.log(`${message.content}`);
					if (!message.author.bot) {
						msgs.push(message.content);
					} 
				})
			  });
			console.log(msgs);
			return await interaction.reply(`Messages:\n${msgs}`);  // Print all messages
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		//return interaction.reply('Whoa');
		
	},
};