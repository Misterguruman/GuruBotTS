import type { ChatInputCommandInteraction, CacheType } from "discord.js"

export type PendingTransactions = Record<string, PendingTransaction>

export interface PendingTransaction {
    user: string,
    bet: number,
    user_id: string,
    game: string,
    interaction: ChatInputCommandInteraction<CacheType>
}

export interface ChatGPTResponse {
    "id": string,
    "object": string,
    "created": number,
    "model": string,
    "choices": Array<ChatGPTChat>,
    "usage": {
        "prompt_tokens": number,
        "completion_tokens": number,
        "total_tokens": number
    }
}

export interface ChatGPTChat {
    "index": number,
    "message": {
        "role": "assistant" | "user" | "system" | "function",
        "content": string
    },
    "finish_reason": string
}

export interface DiscordEvent {
  name: string,
  execute: any
}
