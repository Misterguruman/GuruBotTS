import { Events, Message } from 'discord.js'
import { ColorSelector } from '../utils/TerminalColor'

export default {
    name: Events.MessageCreate, 
    execute: (eventData: Message) => {
        eventData.fetch() 
        .then((message) => {
            console.log( `${ColorSelector.BgGreen}` + `${ColorSelector.FgBlack}` + `${message.guild} (${message.guildId}): ${message.author.tag}` +
                                        `${ColorSelector.Reset}` +  `=> ${message.content}"`)

        } ,(error) => console.log(`ERROR: ${error}`))
    }
}
