import { pino } from "pino"
import { mkdir } from "node:fs/promises";

await mkdir("./logs", { recursive: true })

const logger = pino({
    level: Bun.env.LOG_LEVEL ?? "info",
    transport: Bun.env.DISCORD_WEBHOOK_URL ? {        
        targets: [
        { 
            target: "pino-pretty",
            options: { colorize: true } 
        }, 
        {
            target: "pino/file",
            options: {
                destination: "./logs/app.log",
                mkdir: true,
                // rotates at midnight, keeps 7 files
                interval: "1d",
                maxFiles: 7,
            }
        }, 
        {
            target: 'pino-discord-webhook',
            options: { webhookUrl: Bun.env.DISCORD_WEBHOOK_URL }
        }
    ]
    }: {
        targets: [
        { 
            target: "pino-pretty",
            options: { colorize: true } 
        }, 
        {
            target: "pino/file",
            options: {
                destination: "./logs/app.log",
                mkdir: true,
                // rotates at midnight, keeps 7 files
                interval: "1d",
                maxFiles: 7,
            }
        }
        ]
    }
})

export default logger
