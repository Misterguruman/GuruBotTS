import { createClient, PostgrestResponse } from "@supabase/supabase-js"
import type {PostgrestSingleResponse} from '@supabase/supabase-js'
import { definitions } from "../types/SupabaseTypes"
import * as dotenv from 'dotenv'
import { isBuffer } from "util"
dotenv.config()

//Supabase instance up here so we can load it in parallel with the discord client
export const supabase = createClient(process.env.SUPABASEURL!, process.env.SUPABASEKEY!)

export async function getAllTableData(): Promise<definitions['players'][] | null> {
    let { data, error } =  await supabase
        .from<definitions['players']>("players")
        .select('*')
    
    if (error) return null
    return data
}

export async function updateBalance(discord_id:string, discord_server_id: string, new_balance:number): Promise<definitions['players'] | null>  {
    const { data, error } = await supabase
        .from<definitions['players']>('players')
        .update({balance: new_balance})
        .eq('discord_id', discord_id)
        .eq('discord_server_id', discord_server_id)
        .single()

    if (error) return null
    return data
}

export async function addPlayer(discord_name: string, discord_server_id: string, discord_id: string): Promise<definitions['players'] | null> {
    let {data:player, error} = await supabase
        .from<definitions['players']>('players')
        .insert([
            {discord_name: discord_name, discord_server_id: discord_server_id, discord_id: discord_id, balance: 100}
        ])
        .single();

    if (error) console.log(error)
    return player
}

export async function checkPlayer(discord_name: string, discord_server_id: string): Promise<definitions['players'] | null> {
    const {data, error} = await supabase
        .from<definitions['players']>('players')
        .select("*")
        .eq('discord_name', discord_name) 
        .eq('discord_server_id', discord_server_id)
        .single();
    
    if (error) return null;
    return data
}

export async function getBalance(discord_id:string, discord_server_id:string): Promise<definitions['players'] | null> {
    const {data, error} = await supabase
        .from<definitions['players']>('players')
        .select('balance')
        .eq('discord_id', discord_id)
        .eq('discord_server_id', discord_server_id)
        .single();

    if (error) return null;
    return data;
}

export async function addManagedVC(guildId:string, channelId:string): Promise<definitions['managedvoicechannels'][] | null> {
    let {data, error} = await supabase
        .from<definitions['managedvoicechannels']>('managedvoicechannels')
        .insert([
            {guildId: guildId, channelId: channelId}
        ])

    if (error) return null;
    return data;
}

export async function getManagedVC(channelId:string): Promise<definitions['managedvoicechannels'] | null> {
    let {data, error} = await supabase
        .from<definitions['managedvoicechannels']>('managedvoicechannels')
        .select('*')
        .eq('channelId', channelId)
        .single();

    if (error) return null;
    return data;
}

export async function deleteManagedVC(guildId:string, channelId:string): Promise<definitions['managedvoicechannels'][] | null> {
    let {data, error} = await supabase
        .from<definitions['managedvoicechannels']>('managedvoicechannels')
        .delete()
        .eq('guildId', guildId)
        .eq('channelId', channelId)

    if (error) return null;
    return data;
}

export async function getManagedVCbyServer(guildId:string): Promise<definitions['managedvoicechannels'][] | null> {
    let {data, error} = await supabase
        .from<definitions['managedvoicechannels']>('managedvoicechannels')
        .select('*')
        .eq('guildId', guildId)

    if (error) return null;
    return data;
}
