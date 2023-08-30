import { Events, Guild } from "discord.js"

export default {
  name: Events.GuildDelete,
  execute: (eventData: Guild) => {
    console.log(`${eventData.name} has removed the bot. ID: ${eventData.id}`)
  }
}
