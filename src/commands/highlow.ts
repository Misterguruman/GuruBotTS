import { ComponentType, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { getBalance, updateBalance } from '../utils/SupabaseHandler';
import { Deck, isHigh, isLow, calculateOddsHigh, calculateOddsLow, getDiscordValue } from '../utils/CardHandler'
import type {Card} from 'card-games-typescript'
import { definitions } from '../types/SupabaseTypes'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('highlow')
    .setDescription('Start a new High/Low game with the casino')
    .addStringOption(option => 
        option.setName('value')
        .setDescription('The value you would like to place for your bet')
        .setRequired(true)),
        
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        console.log(`${interaction.user.tag} has triggered /highlow in ${interaction.guild!.name} with a bet ${interaction.options.getString('value')}`)
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
            return;
        }


        if (balance?.balance! >= bet!) {
            let firstDraw = deck.drawCard()
            let secondDraw = deck.drawCard()
            await interaction.reply({content: `We're starting with a freshly shuffled deck. The card is ${getDiscordValue(firstDraw)}, select your bet`, components: [row], ephemeral:true})
            
            const buttonFilter = (i:any) => i.customId == 'low' || i.customId == 'high' && i.user.id == interaction.user.id  
            interaction.channel?.createMessageComponentCollector({filter: buttonFilter, componentType: ComponentType.Button, time: 5 * 1000})
            .on('collect', (click) => {
                handleClick(click, firstDraw, secondDraw, balance!.balance!, bet).then(() => {return})
            })
            .on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.editReply({content: `You did not select an option in time, please try again`, components:[]}).then(() => {return})
                } 
            })
        } 
        else { 
            await interaction.reply({content:`Insufficient Funds. Your current balance is $${balance?.balance}`, ephemeral:true}) 
        }
    },

}

async function handleClick(click:ButtonInteraction, firstDraw:Card, secondDraw:Card, balance:number, bet:number) {
    if (click.customId == 'high') {
        if (isHigh(firstDraw, secondDraw)) {
            await click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You won! Congratulations`, components:[]})
            await updateBalance(click.user.id, click.guild!.id, balance + bet)
            return;
        } else {
            await click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You lost :( Better luck next time`, components:[]})
            await updateBalance(click.user.id, click.guild!.id, balance - bet)
            return;
        }
    }
    if (click.customId == 'low') {
        if (isLow(firstDraw, secondDraw)) {
            await click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You won! Congratulations`, components:[]})
            await updateBalance(click.user.id, click.guild!.id, balance + bet)
            return;
        }else {
            await click.update({content:`Second card was ${getDiscordValue(secondDraw)}. You lost :( Better luck next time`, components:[]})
            await updateBalance(click.user.id, click.guild!.id, balance + bet)
            return;
        }
    }

}