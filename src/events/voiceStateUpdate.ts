import { VoiceState, ChannelType, NewsChannel } from "discord.js";
import { getManagedVC, getManagedVCbyServer } from "../utils/SupabaseHandler"

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState:VoiceState, newState:VoiceState) { 
        if (oldState.channel !== newState.channel) {
            if (newState.channel) console.log(`${newState.member!.displayName} is in ${newState.guild.name} in channel ${newState.channel.name}`)

            let managed = await getManagedVCbyServer(newState.guild.id)
            //see if channel is managed

            if (oldState.channelId && oldState.channel) {
                // What duh heeeeeeeeeelllllllllll
                if (oldState.client.managedVCs.includes(oldState.channelId)) {
                    let generatedVC = await oldState.channel.fetch()
                    console.log(`Members in VC: ${generatedVC.members.size}`)
                    if (!generatedVC.members.size) {
                        await oldState.channel.delete('Channel is empty')
                        oldState.client.managedVCs.filter((value) => value !== oldState.channel?.id)
                    }

                }
            }

            if (!newState.channel) { 
                console.log(`${newState.member!.displayName} has disconnected from chat`)
                return;
            }
            
            let applicable = managed?.filter((entry) => entry.channelId === newState.channelId).pop()
            if (!applicable) return;

            let count = newState.channel!.parent!.children.valueOf().filter((channel) => channel.name.startsWith(`${newState.channel!.parent?.name.split(' ').join("-")}`))

            //if it is, create a new vc in the same category/parent
            let guild = await newState.guild.fetch()
            let newChannel = await guild.channels.create({type: ChannelType.GuildVoice, name:`${newState.channel!.parent?.name.split(' ').join("-")}-${count.size + 1}`, parent: oldState.channel!.parent?.id})
            await newState.member?.voice.setChannel(newChannel)

            newState.client.managedVCs.push(newChannel.id)
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