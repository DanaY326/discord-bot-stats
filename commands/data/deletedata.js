const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const sql = require("mssql");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('deletedata')
		.setDescription('Deletes all data related to this server!'),
    async execute(interaction) {
        const serverName = `${interaction.guild.name}`;

		try {
			const serverIdRes = await sql.query`DECLARE @guild NVARCHAR(255) = ${serverName}; 
												SELECT id FROM dbo.Guilds WHERE guild_name = @guild;`;

            const serverIdArr = serverIdRes.recordset;
            if (serverIdArr.length === 0) {
                return await interaction.reply('No data found for this server!');
            }
            server_id = Object.values(serverIdArr[0])[0];

            const result = await sql.query`DECLARE @server_id INT = ${server_id};
												
												SELECT user_id
													FROM dbo.Memberships 
													WHERE guild_id = @server_id;`
            const resultArr = result.recordset;
            for (const userIdObj of resultArr) {
                const userId = Object.values(userIdObj)[0];
                await sql.query`DECLARE @user_id INT = ${userId};
                                DECLARE @server_id INT = ${server_id};

                                IF NOT EXISTS
                                    (SELECT 1 FROM dbo.Memberships
                                        WHERE user_id = @user_id
                                            AND NOT guild_id = @server_id)
                                BEGIN                
                                    DELETE FROM dbo.Users 
                                        WHERE id = @user_id;
                                END`;
            }
            await sql.query`DECLARE @server_id INT = ${server_id};
                                
                                DELETE FROM dbo.Guilds 
                                    WHERE id = @server_id;`;
			return await interaction.reply(`Finished deleting data!`);
		} catch(error) {
			console.error(error);
			console.log(`Error:\n\`${error.message}\``);
            return interaction.reply({content: `There was an error while executing this command!`, flags: MessageFlags.Ephemeral});
		}
		
	},
};