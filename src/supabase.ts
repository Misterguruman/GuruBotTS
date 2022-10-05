import { createClient, PostgrestResponse } from "@supabase/supabase-js"
import { definitions } from "./types/supabase-types"
import * as dotenv from 'dotenv'
import e from "express"
dotenv.config()

//Supabase instance up here so we can load it in parallel with the discord client
export const supabase = createClient(process.env.SUPABASEURL!, process.env.SUPABASEKEY!)

export async function getAllTableData() {
    let { data, error } =  await supabase.from<definitions['players']>("players").select('*')
    if (error) return 'ERROR'
    return data
}

export async function updateBalance(discord_id:string, new_balance:number)  {
    const { data, error } = await supabase
    .from<definitions['players']>('players')
    .update({balance: new_balance})
    .eq('discord_id', discord_id)

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

export async function addPlayer(discord_name: string, discord_server_id: string, discord_id: string) {
    let {data:player, error} = await supabase
    .from<definitions['players']>('players')
    .insert([
        {'discord_name': discord_name, 'discord_server_id': discord_server_id, 'discord_id': discord_id}])

    if (error) console.log(error)
    return player
}

export async function checkPlayer(discord_name: string, discord_server_id: string) {
    const {data, error} = await supabase
    .from<definitions['players']>('players')
    .select("*")
    .eq('discord_name', discord_name) 
  
    return data
}

function initDatabase() {
    console.log('Supabase intaliized')
}


