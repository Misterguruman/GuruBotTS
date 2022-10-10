import { REST, Routes } from 'discord.js'
import type { SlashCommandBuilder } from 'discord.js';
import { client } from '..'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs';
import * as path from 'node:path'

export async function RegisterSlashCommand(gid:string) {
    dotenv.config()
    let commands: Array<JSON> = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }
    
    // console.log(commands)
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORDTOKEN!);

    let data:any = await rest.put(Routes.applicationGuildCommands(process.env.DISCORDCLIENTID!, gid), { body: commands })
    
    if (data) {
        console.log(`Successfully registered ${data.length} application commands to Guild ID: ${gid}.`)
    }
}

export async function validateSlashCommands() {
	let guildCommands = await Promise.all(client.guilds.cache.map((guild) => guild.commands.fetch()))
	let clientCommands:string[] = [...client.commands.keys()]
	// return guildCommands
	let invalidGuilds = guildCommands.reduce<string[]>((acc, cv) => {
		let gid:string = cv.first()!.guildId!
		let thisGuildCommands = cv.map((ac) => ac.name)

		if (clientCommands.every((commandName) => thisGuildCommands.includes(commandName))) return acc;

		acc.push(gid)
		return acc
	}, [])

	if (!invalidGuilds.length) {
		return;
	}

	await Promise.all( invalidGuilds.map((gid) => RegisterSlashCommand(gid)))
}

