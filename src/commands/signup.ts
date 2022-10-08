import { SlashCommandBuilder } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { addPlayer, checkPlayer, updateBalance } from "../utils/SupabaseHandler"

module.exports = {
    data: new SlashCommandBuilder()
    .setName("signup")
    .setDescription("Creates new user in our Casino database with 0 wins/losses and $100"),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) { 
        //See if player is in supabase database already
        let check = await checkPlayer(interaction.user!.tag, interaction.guild!.id)
        //If he is, update their balance to $100
        if (check) {
            await interaction.reply("User already in database, updating your balance")
            let confirm = await updateBalance(interaction.user.id, interaction.guildId!, 100)
            if (confirm) console.log(`${confirm.discord_name} has a balance of ${confirm.balance}`)
            return;
        } 
        //if they are not, add them
        await addPlayer(interaction.user.tag!, interaction.guildId!, interaction.user.id)
        console.log("Adding user")
        //reply to discord and let them know the user is created
        await interaction.reply(`User ${interaction.user.tag} was created in our Guru Casino`)
        console.log("Sending reply")
        
    },
}