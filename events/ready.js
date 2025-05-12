const { Events } = require('discord.js');
/*const sql = require("mssql");

const { sqlLogin } = require("../config.json");
const { sqlPassword } = require("../config.json");
const { sqlServer } = require("../config.json");
const { sqlPort } = require("../config.json");

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
		var config = {
			user: sqlLogin, // Database username
			password: sqlPassword, // Database password
			server: sqlServer, // Server IP address
			database: "discord-messages", // Database name,
			port: sqlPort,
			options: {
				encrypt: true, 
	        	trustServerCertificate: true,
				connectionTimeout: 15000,
                requestTimeout: 15000
            }
		}

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