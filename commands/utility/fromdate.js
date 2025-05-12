const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const sql = require("mssql");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('fromdate')
		.setDescription('Returns all messages in the server from a specific date!')
		.addStringOption(option =>
			option.setName('date')
				.setDescription('The date to get messages from.')
				.setRequired(true)),
    async execute(interaction) {
        const serverName = `${interaction.guild.name}`;
		const date = interaction.options.getString('date', true);

		try {
			const result = await sql.query`DECLARE @date_start SMALLDATETIME = ${date};
												DECLARE @guild NVARCHAR(255) = ${serverName}; 
												DECLARE @server_id INT; 
												SELECT @server_id = id FROM dbo.Guilds WHERE guild_name = @guild;
												
												SELECT message, RIGHT(CONVERT(NVARCHAR(255), date_sent), 7), user_id 
													FROM dbo.Messages 
													WHERE guild_id = @server_id 
														AND date_sent >= @date_start
														AND date_sent <= DATEADD(minute, 59, DATEADD(hour, 23, @date_start))
													ORDER BY date_sent;`;
			const messages = Object.values(result.recordset);
			const len = messages.length;
			var reply = '';
			if (len == 0) {
				return interaction.reply({content: `No messages on ${date}.`, flags: MessageFlags.Ephemeral});
			}
			for (let i = 0; i < len; ++i) {
				const mes = Object.values(messages[i])[0];
				const time = Object.values(messages[i])[1];

				const userId = Object.values(messages[i])[2];
				const userRes = await sql.query`DECLARE @user_id INT = ${userId};
												SELECT display_name FROM dbo.Users WHERE id = @user_id;`;
				const user = Object.values(Object.values(userRes.recordset)[0])[0];

				reply = reply + `\n( ${time} )   ( ${user} )    ${mes}`;
			}
			return await interaction.reply(`Chats from ${date}: ${reply}`);
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		
	},
};