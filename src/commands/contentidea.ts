import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { ChatGPTResponse } from '../types/GuruBotTypes'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('contentidea')
    .setDescription('An AI powered by ChatGPT with the ability to generate content ideas.'),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        interaction.reply('Thinking... ')
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
        
        await interaction.editReply(`${response.data.choices[0].message.content}`)
    }
}