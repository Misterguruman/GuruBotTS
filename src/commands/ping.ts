import { SlashCommandBuilder } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Creates new user in our Casino database with 0 wins/losses and $100"),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) { 
        //this is a test command
        //reply to discord
        await interaction.reply("Pong")

    },
}
    