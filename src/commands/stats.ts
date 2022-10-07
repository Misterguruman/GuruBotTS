import {SlashCommandBuilder} from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Check a user\' balance, wins, losses, and other information'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        return;
        //get player object from supabase

        //parse and reply in a readable format
    }
}