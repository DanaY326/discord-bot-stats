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
		.setDescription('Returns the biggest contributers (yappers) in the server!')
		.addIntegerOption(option =>
			option.setName('number_of_users')
				  .setDescription('The maximum number of top users to give data for (default 10).')),
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
				//console.log(numMessages);
				
				const numUsersRes = await sql.query`SELECT COUNT(DISTINCT userId) FROM dbo.Messages`;
				//console.log(numUsersRes);
				const numUsers = Object.values(numUsersRes.recordset[0]);
				console.log(numUsers);

				const top = Math.min(numUsers, interaction.options.getInteger('number_of_users') ??  10);
				//console.log(top);
			// make this and other error messages ephemeral
				if (top <= 0) {
					return interaction.reply(`No data available for "number_of_users" less than 1!`);
				}
/*
				await sql.query``;
				await sql.query``;*/
				
				result = await sql.query`DECLARE @topNum int; SET @topNum = ${top}; SELECT TOP (@topNum) userId, COUNT(userId) AS numMes FROM dbo.Messages GROUP BY userId ORDER BY COUNT(userId) DESC;`;
				//console.log(result);
				const messages = Object.values(result.recordset);
				//console.log(messages);
				const len = messages.length;
				var reply = '';
				if (len == 0) {
					return interaction.reply(`No readable users in server.`);
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
					return interaction.reply(`${top} active user(s) by percentages of messages: ${reply}`);
				} else {
					return interaction.reply(`Top ${top} active user(s) by percentages of messages: ${reply}`);
				}
				
		} catch(error) {
			console.error(error);
			console.log(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
		
	},
};