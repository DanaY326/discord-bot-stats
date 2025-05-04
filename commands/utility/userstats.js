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
			const numMessagesRes = await sql.query`SELECT COUNT(id) FROM dbo.Messages`;
			const numMessages = Object.values(numMessagesRes.recordset[0]);
			//console.log(numMessages);
			
			const numUsersRes = await sql.query`SELECT COUNT(DISTINCT userId) FROM dbo.Messages`;
			//console.log(numUsersRes);
			const numUsers = Object.values(numUsersRes.recordset[0]);
			console.log(numUsers);

			const top = Math.min(numUsers, interaction.options.getInteger('number_of_users') ??  10);
			//console.log(top);
			if (top <= 0) {
				return interaction.reply({content: `No data available for "number_of_users" less than 1!`, flags: MessageFlags.Ephemeral});
			}
			
			result = await sql.query`DECLARE @topNum int; SET @topNum = ${top}; SELECT TOP (@topNum) userId, COUNT(userId) AS numMes FROM dbo.Messages GROUP BY userId ORDER BY COUNT(userId) DESC;`;
			//console.log(result);
			const messages = Object.values(result.recordset);
			//console.log(messages);
			const len = messages.length;
			var reply = '';
			if (len == 0) {
				return interaction.reply({content: `No readable users in server.`, flags: MessageFlags.Ephemeral}); // not testsed
			}
			for (let i = 0; i < len; ++i) {
				const userId = Object.values(messages[i])[0];
				const userArr = await sql.query`SELECT userName FROM dbo.Users WHERE id = ${userId};`
				//console.log(userArr);
				const userObj = Object.values(userArr.recordset)[0];
				//console.log(userObj);

				const mesNum = Object.values(messages[i])[1];

				reply = reply + `\n(${mesNum / numMessages * 100}%)       ${Object.values(userObj)}`;
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