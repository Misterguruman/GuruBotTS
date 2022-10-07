import type { Interaction, Collection, ChatInputCommandInteraction, CacheType } from "discord.js"


module.exports = {
    name: 'interactionCreate',
	async execute(interaction: Interaction<CacheType> | ChatInputCommandInteraction<CacheType>) {
        
		console.log(`${interaction.user.tag} in #${interaction.guild?.name} triggered an interaction.`);

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            return };

        await command.execute(interaction);


    },
};