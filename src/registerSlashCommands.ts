import { SlashCommandBuilder, REST, Routes } from 'discord.js'
import * as dotenv from 'dotenv'
dotenv.config()


export function RegisterSlashCommand(gid:string) {
    const commands = [
        new SlashCommandBuilder().setName("signup").setDescription("Create a character in Guru Casino, starting with $100, or reset your current character")
    ]
    .map(command => command.toJSON())
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORDTOKEN!);
    rest.put(Routes.applicationGuildCommands(process.env.DISCORDCLIENTID!, gid), { body: commands })
    .then((data: any) => console.log(`Successfully registered ${data.length} application commands to Guild ID: ${gid}.`))
    .catch(console.error);
}



