//IMPORTANT IMPORTS
const embedGen = require('./../../Utils/embedGenerator.js')
const LevelSystem = require('./../../Modules/LevelSystem.js')

// Exporting the command for the commandHandler
module.exports = {
	name: 'levelsystem',
	description: 'Ping!',
	options: [],
	async execute(data) {
        // Check if the LevelSystem module is activated for the guild
		if(!data.guildData.modules?.leveling) {
            embedGen.error("This module isn't activated.", data.client, data.interaction)
            return;
        }

        // Check if the executive user has permission to edit the levelsystem settings
        const member = await data.channel.guild.members.fetch(data.author.user.id);
        if(!permissionChecker.isAdmin(data.guildData, member)) {
            embedGen.error("**You need `ADMINISTRATOR` permissions to use that command!**", data.client, data.interaction)
            return;
        }
	}
};