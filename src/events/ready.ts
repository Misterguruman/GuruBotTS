import { validateSlashCommands } from '../utils/registerSlashCommands'
import { Client, Events } from 'discord.js'
import logger from '../utils/logger'
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10'
import { GuruBotCommandBundle } from '../commands';
import * as fs from 'fs';
import * as path from 'path';

export default {
	name: Events.ClientReady,
	once: true,
	execute: async (client: Client) => {
    if (!client.user) return;
		logger.info(`Ready! Logged in as ${client.user.tag}`);


		let commands: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];

		for (const command of GuruBotCommandBundle) {
			client.commands.set(command.data.name, command);
		}

		await validateSlashCommands()
	},
};
