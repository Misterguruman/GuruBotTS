import { ComponentType, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActionRow, APIMessageActionRowComponent, ButtonInteraction, Message, SelectMenuInteraction, messageLink, InteractionCollector, CollectorFilter } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import type { PendingTransaction } from '../types/GuruBotTypes';
import { getBalance } from '../utils/SupabaseHandler';
import { Deck, isHigh, isLow, calculateOddsHigh, calculateOddsLow, getDiscordValue } from '../utils/CardHandler'

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
        let deck = Deck
        deck.shuffleDeck()

        let balance = await getBalance(interaction.user.id, interaction.guildId!)
        let bet = parseInt(interaction.options.getString('value')!)
        if (!balance) {
            await interaction.reply({ content:'There was an issue finding your account in our database, have you run /signup?', ephemeral:true })
        }


        if (balance?.balance! >= bet!) {
            let firstDraw = deck.drawCard()
            let secondDraw = deck.drawCard()
            await interaction.reply({content: `We're starting with a freshly shuffled deck. The card is ${getDiscordValue(firstDraw)}, select your bet`, components: [row], ephemeral:true})
            
            const buttonFilter = (i:any) => i.customId == 'low' || i.customId == 'high' && i.user.id == interaction.user.id  
            interaction.channel?.createMessageComponentCollector({filter: buttonFilter, componentType: ComponentType.Button})
            .on('collect', (click) => {
                if (click.customId == 'high') {
                    if (isHigh(firstDraw, secondDraw)) {
                        click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You won! Congratulations`, components:[]})
                        return
                    }
                    click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You lost :( Better luck next time`, components:[]})
                    return;
                }

                if (isLow(firstDraw, secondDraw)) {
                    click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You won! Congratulations`, components:[]})
                    return
                }
                click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You lost :( Better luck next time`, components:[]})
                return;


            })
        } 
        else { await interaction.reply(`Insufficient Funds. Your current balance is $${balance?.balance}`) }
            
        //Send the user back a randomized card, provide buttons for high/low bet

        //Respond back with win or loss
        
        //Update supabase database value
    },

}