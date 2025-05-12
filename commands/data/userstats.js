const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const sql = require("mssql");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('userstats')
		.setDescription('Returns the biggest contributers (yappers) in the server!')
		.addIntegerOption(option =>
			option.setName('number_of_users')
				  .setDescription('The maximum number of top users to give data for (default 10).')),
    async execute(interaction) {
        const serverName = `${interaction.guild.name}`;

		try {
			const numMessagesUsersRes = await sql.query`DECLARE @guild NVARCHAR(255) = ${serverName}; 
													DECLARE @server_id INT = (SELECT id FROM dbo.Guilds WHERE guild_name = @guild); 
													SELECT COUNT(DISTINCT user_id), COUNT(id) FROM dbo.Messages WHERE guild_id = @server_id`;

			console.log(Object.values(numMessagesUsersRes.recordset[0]));

			const numMesUsrResArr = Object.values(numMessagesUsersRes.recordset[0])[0];
			const numUsers = numMesUsrResArr[0];
			const numMessages = numMesUsrResArr[1];

			if (numMessages === 0) {
				return interaction.reply({content: 'No messages found in server.', flags: MessageFlags.Ephemeral});
			}

			if (numUsers === 0) {
				return interaction.reply({content: 'No users found in server.', flags: MessageFlags.Ephemeral});
			}

			const top = Math.min(numUsers, interaction.options.getInteger('number_of_users') ??  10);
			if (top <= 0) {
				return interaction.reply({content: `No data available for "number_of_users" less than 1!`, flags: MessageFlags.Ephemeral});
			}
			
			result = await sql.query`DECLARE @topNum int = ${top}; 
										DECLARE @guild NVARCHAR(255) = ${serverName}; 
										DECLARE @server_id INT = (SELECT id FROM dbo.Guilds WHERE guild_name = @guild); 	
												
										SELECT 
											TOP (@topNum) user_id, COUNT(user_id) 
												AS numMes 
											FROM dbo.Messages 
											WHERE guild_id = @server_id
											GROUP BY user_id 
											ORDER BY COUNT(user_id) DESC;`;
			const messages = Object.values(result.recordset);
			const len = messages.length;
			var reply = '';
			if (len == 0) {
				return interaction.reply({content: `No readable users in server.`, flags: MessageFlags.Ephemeral}); // not testsed
			}
			for (let i = 0; i < len; ++i) {
				const userId = Object.values(messages[i])[0];
				const userArr = await sql.query`DECLARE @usr_id int = ${userId}; 
												SELECT display_name FROM dbo.Users WHERE id = @usr_id;`
				const userObj = Object.values(userArr.recordset)[0];

				const mesNum = Object.values(messages[i])[1];

				reply = reply + `\n(${Math.round(mesNum / numMessages * 1000) / 10}%)       ${Object.values(userObj)}`;
			}
			if (top == numUsers) {
				return await interaction.reply(`${top} active user(s) by percentages of messages: ${reply}`);
			} else {
				return await interaction.reply(`Top ${top} active user(s) by percentages of messages: ${reply}`);
			}
				
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		
	},
};