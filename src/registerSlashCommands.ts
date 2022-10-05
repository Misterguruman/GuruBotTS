import { REST, Routes } from 'discord.js'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs';
import * as path from 'node:path'

export function RegisterSlashCommand(gid:string) {
    dotenv.config()
    let commands: Array<JSON> = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }
    
    // console.log(commands)
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORDTOKEN!);

    rest.put(Routes.applicationGuildCommands(process.env.DISCORDCLIENTID!, gid), { body: commands })
    .then((data: any) => console.log(`Successfully registered ${data.length} application commands to Guild ID: ${gid}.`))
    .catch(console.error);
}



