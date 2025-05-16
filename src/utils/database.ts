// Database: gurubot
// Table: managedvoicechannels
// Column: channelId (text)
// Column: guildId (text)
// Column: id (uuid)

// Table: logchannels
// Column: channelId (text)
// Column: guildId (text)
// Column: id (uuid)
import postgres from "postgres";
import type { ManagedVoiceChannel, LogChannel } from "../types/GuruBotTypes";

// Pull the connection string from the environment (e.g. postgres://user:pass@host/db)
const DATABASE_URL = Bun.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/gurubot";
export const sql = postgres(DATABASE_URL, { prepare: true });

/**
 * Ensures managedvoicechannels and logchannels tables exist.
 */
export async function ensureSchema() {
    // Enable the pgcrypto extension so we can default-generate UUIDs
    await sql`
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `;

    // Managed voice channels table – stores the channel <-> guild relationship
    await sql`
    CREATE TABLE IF NOT EXISTS managedvoicechannels (
        id        UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
        channelId TEXT  NOT NULL,
        guildId   TEXT  NOT NULL
    );
    `;

    // Log channels table – same shape, separate concern
    await sql`
    CREATE TABLE IF NOT EXISTS logchannels (
        id        UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
        channelId TEXT  NOT NULL,
        guildId   TEXT  NOT NULL
    );
    `;
}

export async function getManagedVoiceChannel(channelId: string): Promise<ManagedVoiceChannel | null> {
    const [row] = await sql<ManagedVoiceChannel[]>`
        SELECT * FROM managedvoicechannels WHERE channelId = ${channelId} LIMIT 1;
    `;
    return row ?? null;
}

export async function getManagedVoiceChannelsByGuild(guildId: string): Promise<ManagedVoiceChannel[]> {
    return sql<ManagedVoiceChannel[]>`
        SELECT * FROM managedvoicechannels WHERE guildId = ${guildId};
    `;
}

export async function insertManagedVoiceChannel(channelId: string, guildId: string): Promise<ManagedVoiceChannel | null> {
    const [row] = await sql<ManagedVoiceChannel[]>`
        INSERT INTO managedvoicechannels (channelId, guildId)
        VALUES (${channelId}, ${guildId})
        RETURNING *;
    `;
    return row ?? null;
}

export async function deleteManagedVoiceChannel(channelId: string): Promise<boolean> {
    const { count } = await sql`
        DELETE FROM managedvoicechannels WHERE channelId = ${channelId};
    ` as unknown as { count: number };
    return count > 0;
}

export async function getLogChannel(channelId: string): Promise<LogChannel | null> {
    const [row] = await sql<LogChannel[]>`
        SELECT * FROM logchannels WHERE channelId = ${channelId} LIMIT 1;
    `;
    return row ?? null;
}

export async function insertLogChannel(channelId: string, guildId: string): Promise<LogChannel | null> {
    const [row] = await sql<LogChannel[]>`
        INSERT INTO logchannels (channelId, guildId)
        VALUES (${channelId}, ${guildId})
        RETURNING *;
    `;
    return row ?? null;
}

export async function deleteLogChannel(channelId: string): Promise<boolean> {
    const { count } = await sql`
        DELETE FROM logchannels WHERE channelId = ${channelId};
    ` as unknown as { count: number };
    return count > 0;
}

/**
 * Lazily loaded ignore-list in memory. Call `loadIgnoredLogChannels()` once
 * at boot (after ensureSchema) to populate it.
 */
export const ignoredLogChannels: Set<string> = new Set();

export async function loadIgnoredLogChannels() {
    const rows = await sql<{ channelId: string }[]>`
        SELECT channelId FROM logchannels;
    `;
    rows.forEach(r => ignoredLogChannels.add(r.channelId));
}

ensureSchema().catch(err => {
    console.error("Failed to initialise database schema", err);
    process.exit(1);
});
