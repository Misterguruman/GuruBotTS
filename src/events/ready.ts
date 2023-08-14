import { validateSlashCommands } from '../utils/registerSlashCommands'
import * as fs from 'fs';
import * as path from 'path';

module.exports = {
	name: 'ready',
	once: true,
	async execute(client: any) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const commandsPath = path.join(__dirname, '../commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			// Set a new item in the Collection
			// With the key as the command name and the value as the exported module
			client.commands.set(command.data.name, command);
		}

		await validateSlashCommands()

		

	},
};