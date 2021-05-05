//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'setrole',
	description: 'Sets selected role for specified usage.',
	options: [
        {
            "name":"type",
            "description":"The type of usage.",
            "type":3,
            "required": true,
            "choices":[
                {
                    "name":"Mod Role",
                    "value":"modRole"
                },
                {
                    "name":"Mute Role",
                    "value":"muteRole"
                }
            ]
        },{
            "name":"role",
            "description":"Role.",
            "type":8,
            "required":true
        }
    ],
	async execute(data) {
        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**You don't have the permission to do this!**")]}, data.interaction)
            return;
        }

        console.log(data.args);

		//GET DATA
        const roleType = data.args[0].value;//data.args[0].value;
        const roleID = "NICHTS";//data.channel.id;

        /*
        //SET MODULE DATA
        data.guildData.channels[channelType] = channelID;

        //SAVE GUILD DATA
        data.guildData.save().catch(err => console.log(err));
        */

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Role Set!", "0xFF964F", "Role ID:  **`" + roleID + "/" + roleType + "`**")]}, data.interaction)
	}
};