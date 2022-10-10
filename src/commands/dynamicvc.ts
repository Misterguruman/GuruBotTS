import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import type { ChatInputCommandInteraction, CacheType } from 'discord.js'
import { addManagedVC, getManagedVC, deleteManagedVC } from '../utils/SupabaseHandler'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dynamicvc')
    .setDescription('Manage Dynamic VC Channel in your server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ModerateMembers)
    .addSubcommand(subcommand => 
        subcommand
        .setName('add')
        .setDescription('Choose a VC to add to Guru Managed VCs')
        .addChannelOption(option => 
            option.setName('dynamicvc')
            .setDescription('Select a channel to add:')
            .setRequired(true)
            )
    )
    .addSubcommand(subcommand => 
        subcommand
        .setName('remove')
        .setDescription('Choose a VC to remove from Guru Managed VCs')
        .addChannelOption(option => 
            option.setName('dynamicvc')
            .setDescription('Select a channel to remove:')
            .setRequired(true)
            )
    ),
    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        let subcommand = interaction.options.getSubcommand()
        if (subcommand == 'add') {
            let channel = interaction.options.getChannel('dynamicvc')
            let c = await interaction.client.channels.fetch(channel!.id)
            if (c?.isVoiceBased()) {
                await interaction.reply({content: `You have selected: ${channel}. This will be set as a Dynamic Voice Channel`})
                await addManagedVC(interaction.guild!.id, c!.id)
                return
            }

            await interaction.reply({content: `You selected ${channel}. Please try again and select a Voice Channel`, ephemeral:true})
        } else {
            let channel = interaction.options.getChannel('dynamicvc')
            let c = await interaction.client.channels.fetch(channel!.id)

            let exists = await getManagedVC(c!.id)
            if (exists) {
                await interaction.reply(`${channel} will be removed from our managed voice channels`)
                await deleteManagedVC(interaction.guild!.id, c!.id)
                return;
            }

            await interaction.reply(`${channel} was not found in our managed voice channels, it's already been removed, or try again.`)
        }
    }
}