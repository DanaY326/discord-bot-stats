const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Starts game!'),
	async execute(interaction) {
		await interaction.reply('Pick one of rock, paper or scissors!');
	},
};