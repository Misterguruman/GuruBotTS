import { SlashCommandBuilder } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('highlow')
    .setDescription('Start a new High/Low game with the casino'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        interaction.reply('pong highlow')
    }
}