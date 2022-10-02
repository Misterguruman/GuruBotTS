
export interface IModelPlayers {
    id: number,
    created_at: Date,
    balance: number,
    wins: number,
    losses: number,
    discord_name: string,
    discord_server: string
}

export interface GuildEntry {
    id: string,
    created_at: Date,
    guild_id: string,

}

// export type GuildEntries = GuildEntry[] //A case where i'd use plural, with the base type remaining a singular representation of the object itself.
//In a lot of cases though, i'll just pass T[] to the <>cast type as opposed to constructing an actual type like this UNLESS i need to modify that type like so..
// export type ModifiedGuildEntries = Pick<GuildEntry, "id" | "guild_id">[]
//This type above will be an array of GuildEntry without a created date property.