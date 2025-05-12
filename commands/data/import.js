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
		
		try {

			//imports guild if not already found in database
			await sql.query`DECLARE @guild NVARCHAR(255) = ${interaction.guild.name};
												
												IF NOT EXISTS 
												(SELECT 1 FROM dbo.Guilds 
												 WHERE guild_name = @guild)
												BEGIN 
													INSERT INTO dbo.Guilds 
														(guild_name) 
													VALUES 
														(@guild) 
												END;`;
											
			//imports users and updates membership relationships if user not yet in database
			const membersFetch = await interaction.guild.members.fetch()
				.then(members => {
					for (const memberArr of members) {
						const member = memberArr[1];
						if (!member.user.bot) {
								sql.query`DECLARE @user_name NVARCHAR(255) = ${member.user.username};
											DECLARE @display_name NVARCHAR(255) = ${member.user.globalName};
													
													IF EXISTS 
													(SELECT 1 FROM dbo.Users 
													WHERE user_name = @user_name
														AND display_name = @display_name)
													BEGIN
														SET NOEXEC ON;
													END;
													INSERT INTO dbo.Users 
															(user_name, display_name) 
														VALUES 
															(@user_name, @display_name);
													SET NOEXEC OFF`;
								sql.query`DECLARE @user_name NVARCHAR(255) = ${member.user.username};												
													DECLARE @guild NVARCHAR(255) = ${interaction.guild.name};

													DECLARE @user_id INT,
															@guild_id INT;
															
													SELECT @user_id = id FROM dbo.Users WHERE user_name = @user_name;
													SELECT @guild_id = id FROM dbo.Guilds WHERE guild_name = @guild;
													
													IF EXISTS 
													(SELECT 1 FROM dbo.Memberships 
													WHERE user_id = @user_id
														AND guild_id = @guild_id)
													BEGIN
														SET NOEXEC ON;
													END;

													INSERT INTO dbo.Memberships 
															(user_id, guild_id) 
														VALUES 
															(@user_id, @guild_id);
													SET NOEXEC OFF`;
						}
						
					}})
 				.catch(console.error);

			let guildIdReal = interaction.guild.id;
			
			let channels = client.channels.cache.filter(ch => {
				return ch.guild.id === guildIdReal && ch.lastMessageId != null;
			})			
			
			//finds date of latest uploaded message - goal is to use to implement a way to speed up importing new messages
			/*const dateObj = await sql.query`SELECT TOP 1 date_sent FROM dbo.Messages ORDER BY date_sent DESC;`;
			var dateArr = dateObj.recordset;
			var date_begin;
			if (dateArr.length === 0) {
				date_begin = '1970-01-01 00:00';
			} else {
				date_begin = Object.values(dateArr[0])[0];
			}*/

			//imports messages
			for await (let channelArr of channels) {
				const channel = channelArr[1];
				let ptr = channel.lastMessageId;

				do {
					await channel.messages
						.fetch({ limit: 100, before: ptr.id})
						.then(messages => {
							messages.forEach(message => {
								
								if (!message.author.bot) {
									const localTimeStamp = message.createdTimestamp / 1000 - timeDiffSec;
									
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
            interaction.editReply({content: `There was an error while executing this command!`});
		}
		
	},
};