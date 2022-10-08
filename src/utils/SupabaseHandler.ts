import { createClient, PostgrestResponse } from "@supabase/supabase-js"
import { definitions } from "../types/SupabaseTypes"
import * as dotenv from 'dotenv'
dotenv.config()

//Supabase instance up here so we can load it in parallel with the discord client
export const supabase = createClient(process.env.SUPABASEURL!, process.env.SUPABASEKEY!)

export async function getAllTableData() {
    let { data, error } =  await supabase.from<definitions['players']>("players").select('*')
    if (error) return 'ERROR'
    return data
}

export async function updateBalance(discord_id:string, discord_server_id: string, new_balance:number)  {
    const { data, error } = await supabase
    .from<definitions['players']>('players')
    .update({balance: new_balance})
    .eq('discord_id', discord_id)
    .eq('discord_server_id', discord_server_id)
    .single()

    return data
}

export async function addPlayer(discord_name: string, discord_server_id: string, discord_id: string) {
    let {data:player, error} = await supabase
    .from<definitions['players']>('players')
    .insert([
        {discord_name: discord_name, discord_server_id: discord_server_id, discord_id: discord_id}])

    if (error) console.log(error)
    return player
}

export async function checkPlayer(discord_name: string, discord_server_id: string) {
    const {data, error} = await supabase
    .from<definitions['players']>('players')
    .select("*")
    .eq('discord_name', discord_name) 
    .eq('discord_server_id', discord_server_id)
    .single();
    
    if (error) return null;
    return data
}

export async function getBalance(discord_id:string, discord_server_id:string) {
    const {data, error} = await supabase
    .from<definitions['players']>('players')
    .select('balance')
    .eq('discord_id', discord_id)
    .eq('discord_server_id', discord_server_id)
    .single();

    if (error) return null;
    return data;
}

