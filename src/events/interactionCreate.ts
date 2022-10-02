import { supabase, addPlayer } from "../supabase";


module.exports = {
    name: 'interactionCreate',
	execute(interaction: any) {
        supabase
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

        if (interaction.isChatInputCommand()) {
            switch (interaction.commandName) {
                case 'signup' : 
                    let response: any = addPlayer(interaction.user.tag, interaction.guildId)
                    .then((data) => interaction.reply(`User ${data.discord_name} was created in our Guru Casino`))
                    .catch((error) => interaction.reply(`User was not able to be created. Error: ${error}`))
            }
        }
	},
};