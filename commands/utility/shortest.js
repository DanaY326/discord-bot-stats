const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const express = require("express");
const sql = require("mssql");
//const app = express();

const { sqlLogin } = require("../../config.json");
const { sqlPassword } = require("../../config.json");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('shortest')
		.setDescription('Returns the shortest message in the server!'),
    async execute(interaction) {
        const serverName = `${interaction.guild.name}`;
		const memberCount = `${interaction.guild.memberCount}`;

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
				"encrypt": true, // Disable encryption
				trustServerCertificate: true
			}
		}

		try {
			sql.connect(config, err => {
				if (err) {
					throw err;
				}})
				const result = await sql.query`SELECT TOP 1 message, LEN(message) FROM dbo.Messages ORDER BY LEN(message) ASC, message ASC;`;
				console.log(result);
				const message = Object.values(result.recordset[0]);
				return await interaction.reply(`The shortest message in ${serverName} is '${message[0]}' with length ${message[1]}!`);
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		
	},
};