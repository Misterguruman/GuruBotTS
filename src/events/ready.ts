import { validateSlashCommands } from '../utils/registerSlashCommands'
import { Client, Events } from 'discord.js'
import * as fs from 'fs';
import * as path from 'path';

export default {
	name: Events.ClientReady,
	once: true,
	execute: async (client: Client) => {
    if (!client.user) return;
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const commandsPath = path.join(__dirname, '../commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			client.commands.set(command.data.name, command);
		}

		await validateSlashCommands()
	},
};
