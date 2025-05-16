import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import type { CacheType, SlashCommandSubcommandsOnlyBuilder } from "discord.js"
import dynamicvc from "./dynamicvc"
import kanye from "./kanye"
import test from "./test"

export interface GuruCommand {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder, 
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => any
}

export const GuruBotCommandBundle: GuruCommand[] = [ dynamicvc, kanye, test ]
