import { Events, GuildMember } from "discord.js"

export default {
    name: Events.GuildMemberAdd, 
    execute(eventData: GuildMember) {
        console.log(`${eventData.displayName} has joined ${eventData.guild.name}. ID: ${eventData.id}`)        
    }
}
