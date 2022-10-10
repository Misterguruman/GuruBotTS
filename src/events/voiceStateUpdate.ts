import { VoiceState } from "discord.js";
import { getManagedVC, getManagedVCbyServer } from "../utils/SupabaseHandler"

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState:VoiceState, newState:VoiceState) { 
        if (oldState.channel !== newState.channel) {
            if (newState.channel == null) {
                console.log(`${newState.member!.displayName} has disconnected from chat`)
                return;
            }

            //see if channel is managed
            console.log(`${newState.member!.displayName} is in ${newState.guild.name} in channel ${newState.channel.name}`)
            let managed = await getManagedVCbyServer(newState.guild.id)

            if (managed!.every((entry) => newState.channelId !== entry.channelId)) {
                return;
            }
            //if it is, create a new vc in the same category/parent

            //move the user to the new voice channel

        }

        if (oldState.streaming !== newState.streaming) {
            if (newState.streaming) {
                console.log(`${newState.member!.displayName} is in ${newState.guild.name} now streaming in ${newState.channel!.name}`)
                return;
            }

            console.log(`${newState.member!.displayName} is no longer streaming`)
        }


        // console.log(`${newState.member!.displayName} is in channel ${newState.channel}`)
    }
}