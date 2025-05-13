const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const sql = require("mssql");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('longest')
		.setDescription('Returns the longest message in the server!'),
    async execute(interaction) {
        const serverName = `${interaction.guild.name}`;

		try {
			const result = await sql.query`DECLARE @guild NVARCHAR(255) = ${serverName}; 
												DECLARE @server_id INT = (SELECT id FROM dbo.Guilds WHERE guild_name = @guild); 
												
												SELECT TOP 1 message, LEN(message) 
													FROM dbo.Messages 
													WHERE guild_id = @server_id 
														AND message NOT LIKE 'https://tenor.com/view/%'
														AND NOT message = ''
													ORDER BY LEN(message) DESC, message DESC;`;
			mesObj = result.recordset[0];
			if (mesObj == null) {
				return await interaction.reply({content: `No messages found in server.`, flags: MessageFlags.Ephemeral});
			}
			const message = Object.values(mesObj);
			return await interaction.reply(`The longest message in ${serverName} is '${message[0]}' with length ${message[1]}!`);
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		
	},
};