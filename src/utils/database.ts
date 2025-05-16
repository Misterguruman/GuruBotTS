/*
 * Bun + MariaDB (https://mariadb.com/kb/en/mariadb-connector-nodejs/)
 * Utility for the *gurubot* self‑hosted database. Provides minimal schema
 * bootstrap plus typed CRUD helpers for:
 *   - managedvoicechannels
 *   - logchannels
 */

import mariadb from "mariadb";

// Connection string like: mysql://user:pass@host:3306/gurubot
const DATABASE_URL = Bun.env.DATABASE_URL ?? "mysql://root:root@localhost:3306/gurubot";

const { hostname: host, username: user, password, pathname, port } = new URL(DATABASE_URL);
const database = pathname.replace(/^\//, "");

export const pool = mariadb.createPool({
  host,
  user,
  password,
  database,
  port: Number(port) || 3306,
  connectionLimit: 5,
});

/* ------------------------------------------------------------
 * Schema bootstrap – idempotent
 * ---------------------------------------------------------- */
export async function ensureSchema() {
  await pool.query(`CREATE TABLE IF NOT EXISTS managedvoicechannels (
      id        CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      channelId TEXT      NOT NULL,
      guildId   TEXT      NOT NULL
  );`);

  await pool.query(`CREATE TABLE IF NOT EXISTS logchannels (
      id        CHAR(36) PRIMARY KEY DEFAULT (UUID()),
      channelId TEXT      NOT NULL,
      guildId   TEXT      NOT NULL
  );`);
}

/* ------------------------------------------------------------
 * Types
 * ---------------------------------------------------------- */
export interface ManagedVoiceChannel {
  id: string;
  channelId: string;
  guildId: string;
}

export interface LogChannel {
  id: string;
  channelId: string;
  guildId: string;
}

/* ------------------------------------------------------------
 * Managed voice channels helpers
 * ---------------------------------------------------------- */

export async function getManagedVoiceChannel(channelId: string): Promise<ManagedVoiceChannel | null> {
  const rows = await pool.query<ManagedVoiceChannel[]>(
    `SELECT * FROM managedvoicechannels WHERE channelId = ? LIMIT 1`,
    [channelId]
  );
  return rows[0] ?? null;
}

export async function getManagedVoiceChannelsByGuild(guildId: string): Promise<ManagedVoiceChannel[]> {
  return pool.query<ManagedVoiceChannel[]>(
    `SELECT * FROM managedvoicechannels WHERE guildId = ?`,
    [guildId]
  );
}

export async function insertManagedVoiceChannel(channelId: string, guildId: string): Promise<ManagedVoiceChannel> {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO managedvoicechannels (id, channelId, guildId) VALUES (?, ?, ?)`,
    [id, channelId, guildId]
  );
  return { id, channelId, guildId };
}

export async function deleteManagedVoiceChannel(channelId: string): Promise<boolean> {
  const res: any = await pool.query(
    `DELETE FROM managedvoicechannels WHERE channelId = ?`,
    [channelId]
  );
  return res.affectedRows > 0;
}

/* ------------------------------------------------------------
 * Log channels helpers
 * ---------------------------------------------------------- */

export async function getLogChannel(channelId: string): Promise<LogChannel | null> {
  const rows = await pool.query<LogChannel[]>(
    `SELECT * FROM logchannels WHERE channelId = ? LIMIT 1`,
    [channelId]
  );
  return rows[0] ?? null;
}

export async function insertLogChannel(channelId: string, guildId: string): Promise<LogChannel> {
  const id = crypto.randomUUID();
  await pool.query(
    `INSERT INTO logchannels (id, channelId, guildId) VALUES (?, ?, ?)`,
    [id, channelId, guildId]
  );
  return { id, channelId, guildId };
}

export async function deleteLogChannel(channelId: string): Promise<boolean> {
  const res: any = await pool.query(
    `DELETE FROM logchannels WHERE channelId = ?`,
    [channelId]
  );
  return res.affectedRows > 0;
}

/* ------------------------------------------------------------
 * Ignored log channels in memory
 * ---------------------------------------------------------- */
export const ignoredLogChannels: Set<string> = new Set();

export async function loadIgnoredLogChannels() {
  const rows = await pool.query<{ channelId: string }[]>(
    `SELECT channelId FROM logchannels`
  );
  rows.forEach(r => ignoredLogChannels.add(r.channelId));
}

/* ------------------------------------------------------------
 * Initialise on module load
 * ---------------------------------------------------------- */
ensureSchema()
  .then(loadIgnoredLogChannels)
  .catch(err => {
    console.error("Database initialisation failed", err);
    process.exit(1);
  });
