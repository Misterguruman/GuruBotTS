import type { Message } from 'discord.js'
import { ColorSelector } from '../utils/tcolor'


module.exports = {
    name: 'messageCreate',
    execute(messagePromise: Message) {
        let messageResult = messagePromise.fetch() 
        .then((message) => {
            console.log( `${ColorSelector.BgGreen}` + `${ColorSelector.FgBlack}` + `${message.guild} (${message.guildId}): ${message.author.tag}` +
                                        `${ColorSelector.Reset}` +  `=> ${message.content}"`)

        } ,(error) => console.log(`ERROR: ${error}`))
    }
}