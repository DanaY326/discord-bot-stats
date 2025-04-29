const { SlashCommandBuilder } = require('discord.js');
const express = require("express");
const sql = require("mssql");
//const app = express();

const { sqlLogin } = require("../../config.json");
const { sqlPassword } = require("../../config.json");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('userstats')
		.setDescription('Returns information about the messages of different users!')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The number of top users to give data for.')),
    async execute(interaction) {
        const serverName = `${interaction.guild.name}`;

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
				const numMessages = await sql.query`SELECT COUNT(id) FROM dbo.Messages`;
				console.log(numMessages);
				
				const numUsers = await sql.query`SELECT COUNT(id) FROM dbo.Users`;
				console.log(numUsers);

				/*const top = interaction.options.getInteger('number', false);
				const result = '';
				console.log(top);
				if (top == 'null') {
					sql.input('top', sql.Int, numUsers);
				} else {
					sql.input('top', sql.Int, top);
				}
				*/
				result = await sql.query`SELECT userId, COUNT(userId) AS numMes FROM dbo.Messages GROUP BY userId ORDER BY COUNT(userId) DESC;`;
				console.log(result);
				const messages = Object.values(result.recordset);
				console.log(messages);
				const len = messages.length;
				var reply = '';
				if (len == 0) {
					return interaction.reply(`No readable users in server.`);
				}
				for (let i = 0; i < len; ++i) {
					const userId = Object.values(messages[i])[0];
					const userArr = await sql.query`SELECT userName FROM dbo.Users WHERE id = ${userId};`
					console.log(userArr);
					const user = Object.values(userArr.recordset)[0];
					console.log(user);
					reply = reply + '\n' + Object.values(user);
				}
				return interaction.reply(`Users: ${reply}`);
		} catch(error) {
			console.error(error);
			console.log(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
		
	},
};