const { SlashCommandBuilder } = require('discord.js');
const { name } = require('../../events/interactionCreate');

const compMove = 0;

function getRandomInt(amount) {
	compMove = Math.floor(Math.random(amount));
}

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Starts game!')
		.addStringOption(option =>
			option.setName('move')
				.setDescription('The move you play.')
				.setRequired(true))
				.addChoices(
					{ name: 'Rock', value: 0 },
					{ name: 'Paper', value: 1 },
					{ name: 'Scissors', value: 2 },
					{ name: 'Gun', value: 3 },
				));
    async execute(interaction) {
        const move = interaction.options.getInt('move', true);
		const moves = ["rock", "paper", "scissors", "gun"];
		const moveName = moves[move];

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