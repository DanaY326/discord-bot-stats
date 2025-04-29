const { SlashCommandBuilder } = require('discord.js');
const express = require("express");
const sql = require("mssql");
//const app = express();

const { sqlLogin } = require("../../config.json");
const { sqlPassword } = require("../../config.json");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('longest')
		.setDescription('Returns the longest message in the server!'),
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
				const result = await sql.query`SELECT TOP 1 message, LEN(message) FROM dbo.Messages ORDER BY LEN(message) DESC, message DESC;`;
				console.log(result);
				const message = Object.values(result.recordset[0]);
				return interaction.reply(`The longest message in ${serverName} is '${message[0]}' with length ${message[1]}!`);
		} catch(error) {
			console.error(error);
			console.log(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
		
	},
};