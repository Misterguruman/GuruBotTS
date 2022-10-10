module.exports = {
    name: 'guildDelete',
    async execute(guild: any) {
        console.log(`${guild.name} has removed the bot. ID: ${guild.id}`)
    }
    
}