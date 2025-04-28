const { SlashCommandBuilder } = require('discord.js');
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
				"encrypt": false, // Disable encryption
	        	trustServerCertificate: true
			}
		}

		try {
			sql.connect(config, err => {
			 if (err) {
				throw err;
			 }
			 return interaction.reply("Connection Successful!");
			});
		} catch(error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
};