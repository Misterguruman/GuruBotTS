import type { ChatInputCommandInteraction, CacheType } from "discord.js"

export type PendingTransactions = Record<string, PendingTransaction>

export interface PendingTransaction {
    user: string,
    bet: number,
    user_id: string,
    game: string,
    interaction: ChatInputCommandInteraction<CacheType>
}