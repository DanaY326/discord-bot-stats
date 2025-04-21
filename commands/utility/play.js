const { SlashCommandBuilder } = require('discord.js');

var compMove = 0;

function getRandomInt(amount) {
	return Math.floor(Math.random() * amount);
}

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Starts game!')
		.addStringOption(option =>
			option.setName('move')
				.setDescription('The move you play.')
				.setRequired(true)
				.addChoices(
					{ name: 'Rock', value: "rock" },
					{ name: 'Paper', value: "paper" },
					{ name: 'Scissors', value: "scissors" },
					{ name: 'Gun', value: "gun" },
				)),
    async execute(interaction) {
        const moveName = interaction.options.getString('move', true);
		const moves = ["rock", "paper", "scissors", "gun"];
		const move = moves.indexOf(moveName);

		if (moveName === "gun") {
            return interaction.reply(`You played ${moveName}. You win!`);
		}

		try {
			compMove = getRandomInt(3);
			if (move === compMove) {
				return interaction.reply(`You played ${moveName} and the computer played ${moves[compMove]}. It's a tie!`);
			} else if ((move - compMove + 3) % 3 === 1) {
				return interaction.reply(`You played ${moveName} and the computer played ${moves[compMove]}. You win!`);
			} else {
				return interaction.reply(`You played ${moveName} and the computer played ${moves[compMove]}. You lose!`);
			}
		} catch(error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
		}
	},
};