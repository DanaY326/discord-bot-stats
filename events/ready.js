const { Events } = require('discord.js');
/*const sql = require("mssql");

const { sqlLogin } = require("../config.json");
const { sqlPassword } = require("../config.json");*/

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
		/*var config = {
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
				"encrypt": true, 
	        	trustServerCertificate: true
			}
		}*/

		try {
			/*sql.connect(config, err => {
			 if (err) {
				throw err;
			 }});*/
			 console.log(`Ready! Logged in as ${client.user.tag}`);
		} catch(error) {
            console.error(error);
            console.log(`There was an error connecting to the server!`);
			return interaction.reply({content: `There was an error initializing the bot!`, flags: MessageFlags.Ephemeral});
		}
    }
};