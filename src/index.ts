// Require the necessary discord.js classes
import { Client, GatewayIntentBits, Guild, OAuth2Guild, Collection } from 'discord.js'
import { supabase, getAllTableData } from './utils/SupabaseHandler';
import type { PendingTransactions, PendingTransaction } from './types/GuruBotTypes' 
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv'
import { response } from 'express';

declare module "discord.js" {
	export interface Client {
		commands: Collection<any, any>
		managedVCs: string[]
	}
}

//Create supabase client
supabase
dotenv.config();

//Create discord.js client
export const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.GuildVoiceStates, 
	GatewayIntentBits.MessageContent, 
	GatewayIntentBits.GuildMembers, 
	] 
});

client.commands = new Collection();
client.managedVCs = []
// Login to Discord with your client's token
client.login(process.env.DISCORDTOKEN)
	.then(() => {
		const eventsPath = path.join(__dirname, 'events');
		const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
		
		//Route all events to commands/{event}.ts  
		
		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args).catch((error:any) => console.log(`ERROR: ${error}`)));
			} else {
				client.on(event.name, (...args) => event.execute(...args).catch((error:any) => console.log(`ERROR: ${error}`)));
			}
		}

	}, (error) => console.error(error))


process.on("unhandledRejection", async (err) => {
	console.error("Unhandled Promise Rejection:\n", err);
});

process.on("uncaughtException", async (err) => {
	console.error("Uncaught Promise Exception:\n", err);
});

process.on("uncaughtExceptionMonitor", async (err) => {
	console.error("Uncaught Promise Exception (Monitor):\n", err);
});


