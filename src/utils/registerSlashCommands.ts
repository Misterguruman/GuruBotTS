import { REST, Routes } from 'discord.js'
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
   
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORDTOKEN!);
  await rest.put(Routes.applicationGuildCommands(process.env.DISCORDCLIENTID!, gid), { body: commands })
  console.log(`Successfully registered ${commands.length} application commands to Guild ID: ${gid}.`)

}

export async function validateSlashCommands() {
  let guildIds = (await client.guilds.fetch()).map((guild) => guild.id)
	let guildCommands = await Promise.all(client.guilds.cache.map((guild) => guild.commands.fetch()))
	let clientCommands:string[] = [...client.commands.keys()]
	
  let guildsToRefresh = guildCommands.reduce<string[]>((acc, cv) => {
    let gid:string;
  
    if (cv.size > 0) {
      gid = cv.first()!.guildId!
      guildIds = guildIds.filter( (g) => g !== gid )
      let thisGuildCommands = cv.map((ac) => ac.name)
      if (clientCommands.every((commandName) => thisGuildCommands.includes(commandName))) return acc;
      acc.push(gid)
    }
  
    return acc;
	}, [])

  if (guildIds.length) {
    guildIds.map((g) => guildsToRefresh.push(g))
  }

	if (!guildsToRefresh.length) {
		return;
	}

	await Promise.all( guildsToRefresh.map((gid) => RegisterSlashCommand(gid)))
}

