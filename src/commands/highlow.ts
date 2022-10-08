import { ComponentType, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActionRow, APIMessageActionRowComponent, ButtonInteraction, Message, SelectMenuInteraction, messageLink, InteractionCollector, CollectorFilter } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import type { PendingTransaction } from '../types/GuruBotTypes';
import { getBalance } from '../utils/SupabaseHandler';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('highlow')
    .setDescription('Start a new High/Low game with the casino')
    .addStringOption(option => 
        option.setName('value')
        .setDescription('The value you would like to place for your bet')
        .setRequired(true)),
        
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        //Start the interaction and place bet amount,
        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('low')
            .setLabel('Bet Low')
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId('high')
            .setLabel("Bet High")
            .setStyle(ButtonStyle.Danger)
        );
        //Make sure user has enough funds in supabase
        let balance = await getBalance(interaction.user.id, interaction.guildId!)
        let bet = parseInt(interaction.options.getString('value')!)
        if (!balance) {
            await interaction.reply({ content:'There was an issue finding your account in our database, have you run /signup?', ephemeral:true })
        }


        if (balance?.balance! >= bet!) {
        
            await interaction.reply({content: "Choose your bet:", components: [row], ephemeral:true})
            
            const buttonFilter = (i:any) => i.customId == 'low' || i.customId == 'high' && i.user.id == interaction.user.id  
            interaction.channel?.createMessageComponentCollector({filter: buttonFilter, componentType: ComponentType.Button})
            .on('collect', (click) => {
                if (click.customId == 'high') {
                    click.update({content:'You selected High Bet', components:[]})
                    return;
                }

                click.update({content:'You selected Low Bet', components:[]})


            })
        } 
        else { await interaction.reply(`Insufficient Funds. Your current balance is $${balance?.balance}`) }
            
        //Send the user back a randomized card, provide buttons for high/low bet

        //Respond back with win or loss
        
        //Update supabase database value
    },

}