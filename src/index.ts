// Require the necessary discord.js classes
import { Client, GatewayIntentBits, Guild, OAuth2Guild, Collection } from 'discord.js'
import { supabase, getAllTableData } from './supabase';
import {RegisterSlashCommand } from'./registerSlashCommands'
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv'

declare module "discord.js" {
	export interface Client {
		commands: Collection<any, any>
	}
}

// import { createClient } from "@supabase/supabase-js"

dotenv.config();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

//Create discord.js client
const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.GuildVoiceStates, 
	GatewayIntentBits.MessageContent, 
	GatewayIntentBits.GuildMembers, 
	GatewayIntentBits.GuildPresences] 
});

//Create supabase client
supabase

client.commands = new Collection();
// Login to Discord with your client's token
client.login(process.env.DISCORDTOKEN);


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


let registered_guilds = client.guilds.fetch()
.then((collection) => {  
	collection.forEach((guild) => {
		RegisterSlashCommand(guild.id)
		// guild.fetch()
		// .then((guild) => { getChannels(guild) })

		
	})
})

//Route all events to commands/{event}.ts  
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		console.log(`Registering ${event.name} as once()`)
		client.once(event.name, (...args) => event.execute(...args).catch((error) => `ERROR: ${error}`));

	} else {
		console.log(`Registering ${event.name} as on()`)
		client.on(event.name, (...args) => event.execute(...args));
	}
}



async function getChannels(guild:Guild) {
	let channels = await guild.channels.fetch()

	channels.forEach((channel) => console.log(JSON.stringify(channel)))
}



let channels = client.channels.valueOf()
console.log(channels.forEach((channel) => console.log(JSON.stringify(channel))))

