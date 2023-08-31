import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { supabase } from './utils/SupabaseHandler';
import { GuruBotEventBundle } from './events/index' 
import * as dotenv from 'dotenv'

declare module "discord.js" {
	export interface Client {
		commands: Collection<any, any>
		managedVCs: string[]
	}
}

supabase
dotenv.config();

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

client.login(process.env.DISCORDTOKEN)
	.then(() => {
    for (let event of GuruBotEventBundle) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }, (error:any) => console.error(error))

process.on("unhandledRejection", async (err) => console.error("Unhandled Promise Rejection:\n", err) );
process.on("uncaughtException", async (err) => console.error("Uncaught Promise Exception:\n", err) );
process.on("uncaughtExceptionMonitor", async (err) => console.error("Uncaught Promise Exception (Monitor):\n", err) );
