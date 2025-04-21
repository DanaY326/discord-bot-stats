const { SlashCommandBuilder } = require('discord.js');

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
				.setRequired(true)),
    async execute(interaction) {
        const moveName = interaction.options.getString('move', true).toLowerCase();
		const moves = ["rock", "paper", "scissors"];
		const gun = "gun";
		const move = moves.indexOf(moveName);

		if (moveName === gun) {
            return interaction.reply(`You played ${moveName}. You win!`);
		}

        if (!moves.includes(moveName)) {
            return interaction.reply(`There is no move with name \`${moveName}\`!`);
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