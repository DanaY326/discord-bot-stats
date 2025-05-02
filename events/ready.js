const { Events } = require('discord.js');
const express = require("express");
const sql = require("mssql");
//const app = express();

const { sqlLogin } = require("../config.json");
const { sqlPassword } = require("../config.json");

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
	    console.log(`Ready! Logged in as ${client.user.tag}`);
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
			 }
			});
		} catch(error) {
            console.error(error);
            console.log(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
    }
};