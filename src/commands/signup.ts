import { SlashCommandBuilder } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { addPlayer, checkPlayer, updateBalance,  } from "../supabase"

module.exports = {
    data: new SlashCommandBuilder()
    .setName("signup")
    .setDescription("Creates new user in our Casino database with 0 wins/losses and $100"),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) { 

        let check = await checkPlayer(interaction.guild!.name, interaction.guild!.id)

        if (check && check[0]) {
            await interaction.reply("User already in database, updating your balance")
            await updateBalance(interaction.user.id, 100)
        } 

        let response: any = addPlayer(interaction.user.tag!, interaction.guildId!, interaction.user.id)
        
        if (!response) {
            await interaction.reply(`Something went wrong in the creation of your user account`)
            return;
        }

        await interaction.reply(`User ${response.discord_name} was created in our Guru Casino`)
        
    },
}