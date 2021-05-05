//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'setchannel',
	description: 'Sets current Channel for specified use.',
	options: [{
        "name":"type",
        "description":"The type of usage.",
        "type":3,
        "required": true,
        "choices":[
            {
                "name":"Audit Log Channel",
                "value":"auditLogChannel"
            },
            {
                "name":"Announcement Channel",
                "value":"announcementChannel"
            },
            {
                "name":"Leave Notice Channel",
                "value":"leaveNoticeChannel"
            }
        ]
    }],
	async execute(data) {
        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**You don't have the permission to do this!**")]}, data.interaction)
            return;
        }

		//GET DATA
        const channelType = data.args[0].value;
        const channelID = data.channel.id;

        //SET MODULE DATA
        data.guildData.channels[channelType] = channelID;

        //SAVE GUILD DATA
        data.guildData.save().catch(err => console.log(err));

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Channel Set!", "0xFF964F", "Channel ID:  **`" + channelID + "/" + channelType + "`**")]}, data.interaction)
	}
};