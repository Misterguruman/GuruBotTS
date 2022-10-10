import {SlashCommandBuilder} from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { getBalance } from '../utils/SupabaseHandler'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('check your balance in the guru casino'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        let balance = await getBalance(interaction.user!.id, interaction.guild!.id)

        if (balance) {
            if (balance.balance! <= 0) {
                await interaction.reply({content:`You are currently out of money, run /signup to reset!`, ephemeral:true})
                return;
            }

            await interaction.reply({content:`Your balance is ${balance.balance!}`, ephemeral:true})
            return;
        }

        await interaction.reply({content:`Your account was not in our system, try running /signup to reset or create a player`, ephemeral:true})
    }
}