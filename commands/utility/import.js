const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const express = require("express");
const sql = require("mssql");
//const app = express();

const { sqlLogin } = require("../../config.json");
const { sqlPassword } = require("../../config.json");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('import')
		.setDescription('Imports all data from the server!'),
    async execute(interaction) {
        const serverName = `${interaction.guild.name}`;
		const memberCount = `${interaction.guild.memberCount}`;

		try {
			let msgs = [];
			message.channel.messages.fetch()
			.then(messages => {
				return messages.each(msg => msgs.push(msg.content));
			})
			console.log(msgs);
			const result = await sql.query`SELECT TOP 1 message, LEN(message) FROM dbo.Messages ORDER BY LEN(message) DESC, message DESC;`;
			console.log(result);
			const message = Object.values(result.recordset[0]);
			return await interaction.reply(`The longest message in ${serverName} is '${message[0]}' with length ${message[1]}!`);
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		
	},
};