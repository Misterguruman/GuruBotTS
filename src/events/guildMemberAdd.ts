import { GuildMember } from "discord.js"

module.exports = {
    name: 'guildMemberAdd',
    async execute(member: GuildMember) {
        console.log(`${member.displayName} has joined ${member.guild.name}. ID: ${member.id}`)        
        // if ( Date.now() - member.user.createdAt.getTime() / (1000 * 60 * 60 * 24) < 7) {

        // }
    }
    
}