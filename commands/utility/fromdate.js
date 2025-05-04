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
		const memberCount = `${interaction.guild.memberCount}`;
		const value = 1;
		const date = interaction.options.getString('date', true);

		try {
			const dateStart = `${date} 00:00`;
			const dateEnd = `${date} 23:59`;
			const result = await sql.query`SELECT message, RIGHT(CONVERT(NVARCHAR(255), date_sent), 8) FROM dbo.Messages WHERE date_sent >= ${dateStart} AND date_sent <= ${dateEnd} ORDER BY date_sent;`;
			//console.log(result);
			const messages = Object.values(result.recordset);
			//console.log(messages);
			const len = messages.length;
			var reply = 234;
			if (len == 0) {
				return interaction.reply({content: `No messages on ${date}.`, flags: MessageFlags.Ephemeral});
			}
			for (let i = 0; i < len; ++i) {
				const mes = Object.values(messages[i])[0];
				const time = Object.values(messages[i])[1];
				reply = reply + `\n(${time})    ${mes}`;
			}
			return await interaction.reply(`Chats from ${date}: ${reply}`);
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		
	},
};