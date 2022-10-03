// Require the necessary discord.js classes
import { Client, GatewayIntentBits, Guild, OAuth2Guild } from 'discord.js'
import { supabase, getAllTableData } from './supabase';
import {RegisterSlashCommand } from'./registerSlashCommands'
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv'

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

//Route all events to commands/{event}.ts  
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		console.log(`Registering ${event.name} as once()`)
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		console.log(`Registering ${event.name} as on()`)
		client.on(event.name, (...args) => event.execute(...args));
	}
}


// Login to Discord with your client's token
client.login(process.env.DISCORDTOKEN);

async function getChannels(guild:Guild) {
	let channels = await guild.channels.fetch()

	channels.forEach((channel) => console.log(JSON.stringify(channel)))
}


let registered_guilds = client.guilds.fetch()
.then((collection) => {  
	collection.forEach((guild) => {
		RegisterSlashCommand(guild.id)
		// guild.fetch()
		// .then((guild) => { getChannels(guild) })

		
	})
})


let channels = client.channels.valueOf()
console.log(channels.forEach((channel) => console.log(JSON.stringify(channel))))

