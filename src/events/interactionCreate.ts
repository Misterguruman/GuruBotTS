import { supabase, addPlayer } from "../supabase";
import type { Interaction, Collection } from "discord.js"

declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, any>
	}
}

module.exports = {
    name: 'interactionCreate',
	async execute(interaction: Interaction) {
        supabase
		console.log(`${interaction.user.tag} in #${interaction.guild?.name} triggered an interaction.`);

        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};