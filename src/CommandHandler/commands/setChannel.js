//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'setchannel',
	description: 'Sets current Channel for specified use.',
	options: [
        {
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
                    "name":"Leave Notice Channel",
                    "value":"leaveNoticeChannel"
                },
                {
                    "name":"LevelUP Announcement Channel",
                    "value":"levelSystemChannel"
                },
                {
                    "name":"Auto Voice Channel",
                    "value":"autoVoiceChannel"
                }
            ]
        },{
            "name":"channel",
            "description":"The channel of choice.",
            "type":7,
            "required": false
        }
    ],
	async execute(data) {
        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

		//GET DATA
        const channelType = data.args[0].value;
        var channelID = data.channel.id;

        //IF CHANNEL ID SPECIFIED
        if(data.args[1]) {
            channelID = data.args[1].value;
        }

        //SET MODULE DATA
        data.guildData.markModified("channels");
        data.guildData.channels[channelType] = channelID;

        //SAVE GUILD DATA
        data.guildData.save().catch(err => console.log(err));

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Channel Set!", "0xFF964F", "Channel ID:  **`" + channelID + "/" + channelType + "`**")]}, data.interaction)
    }
};