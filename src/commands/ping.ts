import { SlashCommandBuilder } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Creates new user in our Casino database with 0 wins/losses and $100"),
    async execute(interaction: any) { 
        await interaction.reply("Pong")

    },
}
    