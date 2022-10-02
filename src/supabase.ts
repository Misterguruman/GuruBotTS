import { createClient } from "@supabase/supabase-js"
import { IModelPlayers, GuildEntry } from "./supabaseModels"
import * as dotenv from 'dotenv'
dotenv.config()

//Supabase instance up here so we can load it in parallel with the discord client
export const supabase = createClient(process.env.SUPABASEURL!, process.env.SUPABASEKEY!)

export async function getAllTableData() {
    let { data, error } =  await supabase.from<IModelPlayers>("players").select()
    if (error) return 'ERROR'
    return data
}

export async function addGuild(gid:string) {
	const { data, error } = await supabase
	.from('guilds')
	.insert([
	  { guildId: gid },
	])
    if (error) return 'ERROR'
    return data
}

export async function checkGuild(gid:string) {
    const {data, error} = await supabase
    .from('guilds')
    .select('*')
    .eq('guild_id', gid)
    if (error) return 'ERROR'
    return data    
}

export async function addPlayer(discord_name: string, discord_server_id: string) {
    const { data, error } = await supabase
    .from('players')
    .insert([
        {'discord_name': discord_name, 'discord_server_id': discord_server_id}])

    if (error) return "ERROR"
    console.log(data[0])
    return data[0]
}

export async function checkPlayer(discord_name: string, discord_server_id: string) {
    const { data, error } = await supabase
    .from('players')
    // .eq()
}
    

function initDatabase() {
    console.log('Supabase intaliized')
}


