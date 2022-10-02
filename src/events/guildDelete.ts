module.exports = {
    name: 'guildDelete',
    execute(guild: any) {
        console.log(`${guild.name} has removed the bot. ID: ${guild.id}`)
    }
    
}