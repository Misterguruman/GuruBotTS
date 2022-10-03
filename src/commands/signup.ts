import { Interaction, SlashCommandBuilder } from 'discord.js'
import { supabase, addPlayer, checkPlayer } from "../supabase"

module.exports = {
    data: new SlashCommandBuilder()
    .setName("signup")
    .setDescription("Creates new user in our Casino database with 0 wins/losses and $100"),
    async execute(interaction: any) { 
        console.log(interaction)
        // supabase
        // let check = await checkPlayer(interaction.guild.name, interaction.guild.id)
        // console.log(interaction)
        // if (check.length !== 0) {
        //     interaction.reply("User already in database, updating your balance")
        //     .then((data: any) => console.log(data))

        // } 

        // let response: any = await addPlayer(interaction.user.tag!, interaction.guildId!)
        // .then((data) => {
        //     interaction.reply(`User ${data.discord_name} was created in our Guru Casino`)
        // }
        // , (error) => interaction.reply(`User was not able to be created. Error: ${error}`))
    },
}