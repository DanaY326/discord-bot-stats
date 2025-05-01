const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const express = require("express");
const sql = require("mssql");
//const app = express();

const { sqlLogin } = require("../../config.json");
const { sqlPassword } = require("../../config.json");

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

		// SQL Server configuration
		var config = {
			"user": sqlLogin, // Database username
			"password": sqlPassword, // Database password
			"server": "danascomputer", // Server IP address
			"database": "discord-messages", // Database name,
			"port": 1433,
			pool: {
				max: 10,
				min: 0,
				idleTimeoutMillis: 30000
			},
			"options": {
				"encrypt": false, // Disable encryption
				trustServerCertificate: true
			}
		}

		try {
			sql.connect(config, err => {
				if (err) {
					throw err;
				}})
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