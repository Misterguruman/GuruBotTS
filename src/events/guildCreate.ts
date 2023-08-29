module.exports = {
	name: 'guildCreate',
	execute(guild: any) {
    console.log(`${guild.name} joined! Guild ID: ${guild.id}`)
	},
};
