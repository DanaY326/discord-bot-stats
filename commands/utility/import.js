const { SlashCommandBuilder, MessageFlags, Client, Message, TextChannel, time } = require('discord.js');
const sql = require("mssql");
const { guildId } = require("../../config.json");

const timestampToString = (timestamp) => {

}

let msgs = [];
let usrs = [];
let dts = [];

const d = new Date();
let timeDiffSec = d.getTimezoneOffset() * 60;

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('import')
		.setDescription('Imports message data from the server!'),
	async execute(interaction) {
		await interaction.deferReply();
		
		const memberCount = `${interaction.guild.memberCount}`;
		try {

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
								if (!message.author.bot) {
									msgs.push(message.content);
									usrs.push(message.author.username);
									const localTimeStamp = message.createdTimestamp - timeDiffSec;
									console.log(localTimeStamp);
									dts.push(dt);
									
									
									sql.query`DECLARE @mes NVARCHAR(255), 
														@usr NVARCHAR(255), 
														@guild NVARCHAR(255), 
														@ts INT, @guildId INT, 
														@usrId INT, 
														@dt SMALLDATETIME;

												SET @guild = ${interaction.guild.id},
													@mes = ${message.content}, 
													@usr = ${message.author.username}, 
													@ts = ${localTimeStamp};

												SELECT @usrId = id FROM dbo.Users WHERE name = @usr;
												SELECT @dt = DATEADD(second, @ts, '1970/01/01 00:00');												
												SELECT @guildId = id FROM dbo.Servers WHERE name = @guild;

												SET;
												IF NOT EXISTS 
												(SELECT * FROM dbo.Messages 
												 WHERE message = @mes 
												 		AND userId = @usrId 
														AND date_sent = @dt 
														AND guildId = @guildId)
												BEGIN 
													INSERT INTO dbo.Messages 
														(message, userId, date_sent, guildId) 
													VALUES 
														(@mes, @usrId, @dt, @guildId) 
												END;`;
								}
							})
							ptr = 0 < messages.size ? messages.at(messages.size - 1) : null;
						});
						
				} while (ptr);
			}

			dtNew = new Date(1746593350);
			
			//console.log(msgs + " \n" + usrs + " \n" + dts);
			interaction.editReply(`Messages:\n${dts}`);  // Print all messages
			return;
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            interaction.editReply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		//return interaction.reply('Whoa');
		
	},
};