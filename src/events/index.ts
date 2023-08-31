import { Events } from "discord.js"
import guildCreate from "./guildCreate"
import guildDelete from "./guildDelete"
import guildMemberAdd from "./guildMemberAdd"  
import interactionCreate from "./interactionCreate"
import messageCreate from "./messageCreate"
import ready from "./ready"
import voiceStateUpdate from "./voiceStateUpdate"

export interface GuruBotEvent {
  name: Events
  once?: true,
  execute: (eventData: undefined) => void
}

export const GuruBotEventBundle: any[] = [ guildCreate, guildDelete, guildMemberAdd, interactionCreate, messageCreate, ready, voiceStateUpdate]
