import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { ChatGPTResponse } from '../types/GuruBotTypes'
import * as dotenv from 'dotenv'
dotenv.config()

module.exports = {
    data: new SlashCommandBuilder()
    .setName('contentidea')
    .setDescription('An AI powered by ChatGPT with the ability to generate content ideas.'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        console.log(`${interaction.user.username} sent the /contentidea command`)

        interaction.reply({ content: ':brain: Thinking... ', ephemeral: true})
        const response: AxiosResponse<ChatGPTResponse, any> = await axios({
            method: 'post',
            url: "https://api.openai.com/v1/chat/completions",
            headers: {'Authorization': `Bearer ${process.env.CHATGPTKEY}`},
            data: {
                "model": "gpt-3.5-turbo",
                "messages": [
                  { 
                    "role": "system",
                    "content": "You are an up and coming content creator on a popular video streaming platform. Your goal is to create engaging content to find a bigger audience and increase retention on your content."
                  },
                  {
                    "role": "user",
                    "content": "What is a good idea for new content?"
                  }
                  ]
            }
        })
        
        await interaction.editReply({ content: `${response.data.choices[0].message.content}\n\n\n I hope you're enjoying this feature, friendly reminder that ChatGPT is a paid service that I pay for out of my own poket, feel free to drop a tip to me on Venmo (@Joseph-Langford-4) or on Cashapp ($JosephLangford)`})
    }
}