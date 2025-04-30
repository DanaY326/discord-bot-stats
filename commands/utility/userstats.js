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
		.setDescription('Returns the top 10 biggest users in the server!')
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
				const numMessagesRes = await sql.query`SELECT COUNT(id) FROM dbo.Messages`;
				const numMessages = Object.values(numMessagesRes.recordset[0]);
				
				const numUsersRes = await sql.query`SELECT COUNT(id) FROM dbo.Users`;
				console.log(numUsersRes);
				const numUsers = Object.values(numUsersRes.recordset[0]);

				/*const top = interaction.options.getInteger('number', false);
				const result = '';
				console.log(top);
				if (top == 'null') {
					sql.input('top', sql.Int, numUsers);
				} else {
					sql.input('top', sql.Int, top);
				}
				*/
				result = await sql.query`SELECT TOP 10 userId, COUNT(userId) AS numMes FROM dbo.Messages GROUP BY userId ORDER BY COUNT(userId) DESC;`;
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
					const userObj = Object.values(userArr.recordset)[0];
					console.log(userObj);

					const mesNum = Object.values(messages[i])[1];

					reply = reply + `\n(${mesNum / numMessages * 100}%)       ${Object.values(userObj)}`;
				}
				return interaction.reply(`Users by percentage of messages: ${reply}`);
		} catch(error) {
			console.error(error);
			console.log(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
		
	},
};