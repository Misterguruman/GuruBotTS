import { Interaction, ChatInputCommandInteraction, CacheType, Events } from "discord.js"

export default {
  name: Events.InteractionCreate, 
	execute: async (eventData: Interaction<CacheType> | ChatInputCommandInteraction<CacheType>): Promise<void> => {  
    if (!eventData.isChatInputCommand()) return;
      const command = eventData.client.commands.get(eventData.commandName);
        if (!command) {
        };
       await command.execute(eventData);
    },
};

