import {Events, Guild} from 'discord.js'

export default { 
  name: Events.GuildCreate,
  execute(eventData: Guild) {
    console.log(`${eventData.name} joined! Guild ID: ${eventData.id}`)
  } 
}
