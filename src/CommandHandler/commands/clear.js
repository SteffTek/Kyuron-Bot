//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');
const auditLogger = require("../../Modules/AuditLog");

const configHandler = require("../../Utils/configHandler");
const utils = require('../../Utils/utils.js');
const config = configHandler.getConfig();

// Exporting the command for the commandHandler
module.exports = {
	name: 'clear',
	description: 'Clear multiple messages',
	options: [
        {
            "name":"amount",
            "description":"Amount (1-200).",
            "type":	4,
            "required": true,
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.moderation) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction);
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.fetch(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            embedGen.error("**You need the `MODERATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        var amount = data.args[0].value;
        if(amount <= 0) {
            amount = 1;
        }
        if(amount > 200) {
            amount = 200;
        }

        //DELETE MESSAGES
        data.channel.bulkDelete(amount);

        //SEND INTERACTION
        APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("CLEAR", utils.getColor("moderation","CLEAR"), "**Deleting last `" + amount + "` messages!**")]}, data.interaction)
    }
};