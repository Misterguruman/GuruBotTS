import {SlashCommandBuilder} from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('testaroo'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        interaction.reply('Test complete, compadre')
    }
}