import { SlashCommandBuilder } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('highlow')
    .setDescription('Start a new High/Low game with the casino')
    .addStringOption(option => 
        option.setName('value')
        .setDescription('The value you would like to place for your bet')
        .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        interaction.reply('pong highlow')
        //Start the interaction and place bet amount,
        
        //Make sure user has enough funds in supabase

        //Send the user back a randomized card, provide buttons for high/low bet

        //Respond back with win or loss
        
        //Update supabase database value
    }
}