import { Interaction, Collection, ChatInputCommandInteraction, CacheType, ButtonInteraction } from "discord.js"


module.exports = {
    name: 'interactionCreate',
	async execute(interaction: Interaction<CacheType> | ChatInputCommandInteraction<CacheType>) {
        
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {

        };

        await command.execute(interaction);


    },
};

