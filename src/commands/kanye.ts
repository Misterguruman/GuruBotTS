import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import type {} from 'axios'

export default {
    data: new SlashCommandBuilder()
    .setName('kanye')
    .setDescription('When you need a random Kanye West quote, this is your command'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const response = await axios({
            method: 'get',
            url: "https://api.kanye.rest/"
        })

        await interaction.reply(`${response.data.quote}`)
    }
}