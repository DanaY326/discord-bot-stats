const { SlashCommandBuilder, MessageFlags, Client, Message, TextChannel, time } = require('discord.js');
const sql = require("mssql");

const d = new Date();
let timeDiffSec = d.getTimezoneOffset() * 60;

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('import')
		.setDescription('Imports message data from the server!'),
	async execute(interaction) {
		await interaction.deferReply();
		const countObj = await sql.query`SELECT date_sent FROM dbo.Messages;`;
		const count = Object.values(countObj.recordset[0])[0];
		const date = (count == 0) ? 0 : new Date(countObj.recordset[0].date_sent);
		
		const memberCount = `${interaction.guild.memberCount}`;
		try {

			await sql.query`DECLARE @guild NVARCHAR(255) = ${interaction.guild.name};
												
												IF NOT EXISTS 
												(SELECT 1 FROM dbo.Guilds 
												 WHERE guild_name = @guild)
												BEGIN 
													INSERT INTO dbo.Guilds 
														(guild_name, kind) 
													VALUES 
														(@guild, 'SV') 
												END;`;
											
			/*interaction.guild.members.fetch()
				.then(member => {
				//console.log(member);
			})*/

			let guildIdReal = interaction.guild.id;
			
			let channels = client.channels.cache.filter(ch => {
				return ch.guild.id === guildIdReal && ch.lastMessageId != null;
			})

			for await (let channelArr of channels) {
				const channel = channelArr[1];
				let ptr = channel.lastMessageId;

				do {
					await channel.messages
						.fetch({ limit: 100, before: ptr.id })
						.then(messages => {
							messages.forEach(message => {
								console.log(message);
								if (!message.author.bot) {
									const localTimeStamp = message.createdTimestamp / 1000 - timeDiffSec;

									console.log(message.content);
									
									sql.query`DECLARE @mes NVARCHAR(255) = ${message.content}; 
												DECLARE @usr NVARCHAR(255) = ${message.author.username}; 
												DECLARE @guild NVARCHAR(255) = ${interaction.guild.name}; 
												DECLARE @ts BIGINT = ${localTimeStamp}; 
												DECLARE @dt SMALLDATETIME = DATEADD(minute, @ts / 60, '1970/01/01 00:00'); 
												DECLARE @guild_id INT, 
														@usr_id INT;

												SELECT @usr_id = id FROM dbo.Users WHERE user_name = @usr;							
												SELECT @guild_id = id FROM dbo.Guilds WHERE guild_name = @guild;
												
												IF NOT EXISTS 
													(SELECT 1 FROM dbo.Messages 
												 	WHERE message = @mes 
												 		AND user_id = @usr_id 
														AND date_sent = @dt 
														AND guild_id = @guild_id)
												BEGIN 
													INSERT INTO dbo.Messages 
														(message, user_id, date_sent, guild_id) 
													VALUES 
														(@mes, @usr_id, @dt, @guild_id) 
												END;`;
								}
							})
							ptr = 0 < messages.size ? messages.at(messages.size - 1) : null;
						});
						
				} while (ptr);
			}

			interaction.editReply({content: `Finished importing!`, flags: MessageFlags.Ephemeral});  // Print all messages
			return;
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            interaction.editReply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		//return interaction.reply('Whoa');
		
	},
};